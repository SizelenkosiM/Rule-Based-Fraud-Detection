from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
from datetime import datetime, timedelta
import json
import os
from dotenv import load_dotenv
from decimal import Decimal
import bcrypt
import jwt
import uuid
from urllib.parse import urlparse

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

JWT_SECRET = os.getenv('JWT_SECRET', 'dev_secret_key')
JWT_EXPIRATION = 24 * 60

# # Database configuration
# db_config = {
#     'host': os.getenv('DB_HOST'),
#     'user': os.getenv('DB_USER'),
#     'password': os.getenv('DB_PASSWORD'),
#     'database': os.getenv('DB_NAME')
# }

# def get_db_connection():
#     return mysql.connector.connect(**db_config)

MYSQL_URL = os.getenv('MYSQL_URL')  # Use Railway's MYSQL_URL

# Fallback config for local development
db_config = {
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME')
}

def get_db_connection():
    if MYSQL_URL:
        # Parse the connection string for production
        url = urlparse(MYSQL_URL)
        return mysql.connector.connect(
            host=url.hostname,
            port=url.port or 3306,
            user=url.username,
            password=url.password,
            database=url.path[1:],  # Remove leading slash
            ssl_disabled=False
        )
    else:
        # Fallback to individual env vars for local development
        return mysql.connector.connect(**db_config)

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id VARCHAR(50) NOT NULL,
        receiver_id VARCHAR(50) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        transaction_date DATETIME NOT NULL,
        status ENUM('pending', 'completed', 'flagged') DEFAULT 'pending',
        description TEXT
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        last_activity_date DATETIME,
        balance DECIMAL(10,2) DEFAULT 0.00
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS alerts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        transaction_id INT NOT NULL,
        rule_triggered VARCHAR(100) NOT NULL,
        alert_date DATETIME NOT NULL,
        description TEXT,
        status ENUM('new', 'reviewed') DEFAULT 'new',
        FOREIGN KEY (transaction_id) REFERENCES transactions(id)
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS fraud_analysts (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at DATETIME NOT NULL,
        last_login DATETIME
    )
    ''')

    users = [
        ('user123', 'Anesu Makombe', (datetime.now() - timedelta(days=100)).strftime('%Y-%m-%d %H:%M:%S'), 2500.00),
        ('user124', 'Panashe Chasi', (datetime.now() - timedelta(days=100)).strftime('%Y-%m-%d %H:%M:%S'), 3000.00),
        ('user125', 'Donald Gumbo', (datetime.now() - timedelta(days=100)).strftime('%Y-%m-%d %H:%M:%S'), 1800.00),
        ('user126', 'Sizelenkosi Mpande', (datetime.now() - timedelta(days=100)).strftime('%Y-%m-%d %H:%M:%S'), 2200.00)
    ]

    for user_id, name, last_activity, balance in users:
        cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
        if not cursor.fetchone():
            cursor.execute('''
            INSERT INTO users (id, name, last_activity_date, balance)
            VALUES (%s, %s, %s, %s)
            ''', (user_id, name, last_activity, balance))

    conn.commit()
    cursor.close()
    conn.close()

# Rule Engine
class RuleEngine:
    def __init__(self, transaction):
        self.transaction = transaction
        self.rules = [
            self.check_single_transaction_limit,
            self.check_monthly_cumulative_limit,
            self.check_dormant_account_activation
        ]
        self.alerts = []

    def run_rules(self):
        for rule in self.rules:
            rule()
        return self.alerts

    def check_single_transaction_limit(self):
        # Rule 1: Flag transactions exceeding $500
        if float(self.transaction['amount']) >= 500:
            self.alerts.append({
                'rule_triggered': 'single_transaction_limit',
                'description': f"Transaction amount ${self.transaction['amount']} exceeds the $500 limit"
            })

    def check_monthly_cumulative_limit(self):
        # Rule 2: Flag accounts exceeding $1000 in total transactions within 30 days
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        thirty_days_ago = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d %H:%M:%S')

        cursor.execute('''
        SELECT SUM(amount) as total_amount FROM transactions
        WHERE sender_id = %s AND transaction_date >= %s AND status != 'flagged'
        ''', (self.transaction['sender_id'], thirty_days_ago))

        result = cursor.fetchone()
        current_total = result['total_amount'] if result['total_amount'] else 0

        new_total = current_total + Decimal(str(self.transaction['amount']))

        if new_total > 1000:
            self.alerts.append({
                'rule_triggered': 'monthly_cumulative_limit',
                'description': f"Monthly transactions total ${new_total} exceeds the $1000 limit"
            })

        cursor.close()
        conn.close()

    def check_dormant_account_activation(self):
        # Rule 3: Flag sudden activity after >90 days of inactivity with amounts >$100
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute('''
        SELECT last_activity_date FROM users WHERE id = %s
        ''', (self.transaction['sender_id'],))

        user = cursor.fetchone()

        if user and user['last_activity_date']:
            last_activity = user['last_activity_date']
            days_inactive = (datetime.now() - last_activity).days

            if days_inactive > 90 and float(self.transaction['amount']) >= 100:
                self.alerts.append({
                    'rule_triggered': 'dormant_account_activation',
                    'description': f"Sudden activity after {days_inactive} days of inactivity with amount ${self.transaction['amount']}"
                })

        cursor.close()
        conn.close()

# Authentication Helpers
def hash_password(password):
    """Hash a password for storing."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(stored_password, provided_password):
    """Verify a stored password against a provided password."""
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_password.encode('utf-8'))

def generate_token(user_id):
    """Generate a JWT token."""
    payload = {
        'exp': datetime.utcnow() + timedelta(seconds=JWT_EXPIRATION),
        'iat': datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')

def decode_token(token):
    """Decode a JWT token."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# Authentication middleware
def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')

        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        user_id = decode_token(token)
        if not user_id:
            return jsonify({'message': 'Token is invalid or expired!'}), 401

        return f(*args, **kwargs)

    decorated.__name__ = f.__name__
    return decorated

@app.route('/')
def serve_index():
    return send_from_directory('../', 'payment.html')

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json

    if not data or not data.get('username') or not data.get('password') or not data.get('name'):
        return jsonify({'message': 'Missing required fields'}), 400

    username = data['username']
    password = data['password']
    name = data['name']

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute('SELECT * FROM fraud_analysts WHERE username = %s', (username,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({'message': 'Username already exists'}), 409

    hashed_password = hash_password(password)

    user_id = str(uuid.uuid4())

    try:
        cursor.execute(
            'INSERT INTO fraud_analysts (id, username, password, name, created_at) VALUES (%s, %s, %s, %s, %s)',
            (user_id, username, hashed_password, name, datetime.now())
        )
        conn.commit()

        return jsonify({
            'message': 'Registration successful',
            'user_id': user_id
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({'message': f'Error registering user: {str(e)}'}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json

    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing username or password'}), 400

    username = data['username']
    password = data['password']

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute('SELECT * FROM fraud_analysts WHERE username = %s', (username,))
    user = cursor.fetchone()

    if not user or not verify_password(user['password'], password):
        cursor.close()
        conn.close()
        return jsonify({'message': 'Invalid username or password'}), 401

    cursor.execute('UPDATE fraud_analysts SET last_login = %s WHERE id = %s', (datetime.now(), user['id']))
    conn.commit()

    token = generate_token(user['id'])

    cursor.close()
    conn.close()

    return jsonify({
        'token': token,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'name': user['name']
        }
    }), 200

# API Routes
@app.route('/api/transactions', methods=['POST'])

def create_transaction():
    transaction_data = request.json


    transaction_data['transaction_date'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')


    required_fields = ['sender_id', 'receiver_id', 'amount', 'description']
    for field in required_fields:
        if field not in transaction_data:
            return jsonify({
                'status': 'error',
                'message': f'Missing required field: {field}'
            }), 400

    rule_engine = RuleEngine(transaction_data)
    alerts = rule_engine.run_rules()

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('''
        INSERT INTO transactions (sender_id, receiver_id, amount, transaction_date, status, description)
        VALUES (%s, %s, %s, %s, %s, %s)
        ''', (
            transaction_data['sender_id'],
            transaction_data['receiver_id'],
            transaction_data['amount'],
            transaction_data['transaction_date'],
            'flagged' if alerts else 'completed',
            transaction_data.get('description', '')
        ))

        transaction_id = cursor.lastrowid

        for alert in alerts:
            cursor.execute('''
            INSERT INTO alerts (transaction_id, rule_triggered, alert_date, description)
            VALUES (%s, %s, %s, %s)
            ''', (
                transaction_id,
                alert['rule_triggered'],
                datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                alert['description']
            ))

        cursor.execute('''
        UPDATE users SET last_activity_date = %s WHERE id = %s
        ''', (transaction_data['transaction_date'], transaction_data['sender_id']))

        if cursor.rowcount == 0:
            cursor.execute('''
            INSERT INTO users (id, name, last_activity_date)
            VALUES (%s, %s, %s)
            ''', (
                transaction_data['sender_id'],
                transaction_data.get('sender_name', f"User {transaction_data['sender_id']}"),
                transaction_data['transaction_date']
            ))

        conn.commit()

        response = {
            'transaction_id': transaction_id,
            'status': 'flagged' if alerts else 'completed',
            'alerts': alerts
        }

        return jsonify(response)

    except Exception as e:
        conn.rollback()
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    user_id = request.args.get('user_id')
    limit = request.args.get('limit')

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = '''
    SELECT * FROM transactions
    '''

    params = []

    if user_id:
        query += ' WHERE sender_id = %s OR receiver_id = %s '
        params.extend([user_id, user_id])

    query += ' ORDER BY transaction_date DESC'

    if limit:
        query += ' LIMIT %s'
        params.append(int(limit))

    cursor.execute(query, params)
    transactions = cursor.fetchall()

    for transaction in transactions:
        if 'transaction_date' in transaction and transaction['transaction_date']:
            transaction['transaction_date'] = transaction['transaction_date'].isoformat()

    cursor.close()
    conn.close()

    return jsonify(transactions)

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute('''
    SELECT a.*, t.sender_id, t.receiver_id, t.amount
    FROM alerts a
    JOIN transactions t ON a.transaction_id = t.id
    ORDER BY a.alert_date DESC
    ''')

    alerts = cursor.fetchall()

    for alert in alerts:
        if 'alert_date' in alert and alert['alert_date']:
            alert['alert_date'] = alert['alert_date'].isoformat()

    cursor.close()
    conn.close()

    return jsonify(alerts)

@app.route('/api/alerts/<int:alert_id>/review', methods=['PUT'])
def review_alert(alert_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('UPDATE alerts SET status = %s WHERE id = %s', ('reviewed', alert_id))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({'status': 'success'})

@app.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
    user = cursor.fetchone()

    if not user:
        cursor.close()
        conn.close()
        return jsonify({'status': 'error', 'message': 'User not found'}), 404

    if 'last_activity_date' in user and user['last_activity_date']:
        user['last_activity_date'] = user['last_activity_date'].isoformat()

    cursor.close()
    conn.close()

    return jsonify(user)

@app.route('/api/user/<user_id>/balance', methods=['PUT'])
def update_balance(user_id):
    data = request.json

    if 'balance' not in data:
        return jsonify({'status': 'error', 'message': 'Balance not provided'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('UPDATE users SET balance = %s WHERE id = %s',
                      (data['balance'], user_id))

        if cursor.rowcount == 0:
            cursor.execute(
                'INSERT INTO users (id, name, balance, last_activity_date) VALUES (%s, %s, %s, %s)',
                (user_id, data.get('name', f'User {user_id}'), data['balance'], datetime.now())
            )

        conn.commit()

        return jsonify({'status': 'success', 'balance': data['balance']})

    except Exception as e:
        conn.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

    finally:
        cursor.close()
        conn.close()

# if __name__ == '__main__':
#     init_db()
#     app.run(debug=True)

if __name__ == '__main__':
    init_db()
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
