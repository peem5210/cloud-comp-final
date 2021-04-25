import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import pandas as pd

class MySQLConnector:
    def __init__(self):
        load_dotenv()
        self.connection = self.connect_mysql()

    def connect_mysql(self):
        connection = mysql.connector.connect(
            host=os.getenv('MYSQL_HOSTNAME'),
            user=os.getenv('MYSQL_USERNAME'),
            password=os.getenv('MYSQL_PASSWORD'),
            database=os.getenv('MYSQL_DATABASE')
        )
        if connection.is_connected():
            db_Info = connection.get_server_info()
            print("Connected to MySQL Server version ", db_Info)
        return connection

    def read_query_to_df(self,query):
        return pd.read_sql(query,self.connection)

    def df_insert(self,df,table_name):
        return df.to_sql(table_name, self.connection)

    def execute_query(self,query):
        cur=self.connection.cursor()
        cur.execute(query)
        row = cur.fetchall()
        self.connection.commit()
        cur.close()
        return row

    # def get_order(self):
    #     connection = self.connect()
    #     if connection.is_connected():
    #         try: 
    #             cursor = connection.cursor()
    #             cursor.execute("select * from CUSTOMER_ORDER;")
    #             record = cursor.fetchall()           
    #             attribute = ['order_number', 'detail', 'customer_name', 'customer_address', 'customer_phone_number', 'status']
    #             column = [{"title":x, "dataKey":x, "key":x} for x in attribute]
    #             order_list = [{} for i in range(len(record))]
    #             for i in range(len(record)):
    #                 for j in range(len(attribute)):
    #                     if type(record[i][j]) == str:
    #                         order_list[i][attribute[j]] = record[i][j].strip()
    #                     else:
    #                         order_list[i][attribute[j]] = record[i][j]
    #             message = (True, "Success", order_list, column)
    #         except Error as e : 
    #             message = (False, "Error while executing to MySQL "+str(e))
    #         cursor.close()
    #     else:
    #         message = (False, "Connection lost")
    #     connection.close()
    #     return message
    
    # def get_order_by_status(self, status):
    #     connection = self.connect()
    #     if connection.is_connected():
    #         try: 
    #             cursor = connection.cursor()
    #             cursor.execute("select * from CUSTOMER_ORDER where status = '{}';".format(status))
    #             record = cursor.fetchall()           
    #             attribute = ['order_number', 'detail', 'customer_name', 'customer_address', 'customer_phone_number', 'status']
    #             column = [{"title":x, "dataKey":x, "key":x} for x in attribute]
    #             order_list = [{} for i in range(len(record))]
    #             for i in range(len(record)):
    #                 for j in range(len(attribute)):
    #                     if type(record[i][j]) == str:
    #                         order_list[i][attribute[j]] = record[i][j].strip()
    #                     else:
    #                         order_list[i][attribute[j]] = record[i][j]
    #             message = (True, "Success", order_list, column)
    #         except Error as e : 
    #             message = (False, "Error while executing to MySQL "+str(e))
    #         cursor.close()
    #     else:
    #         message = (False, "Connection lost")
    #     connection.close()
    #     return message
