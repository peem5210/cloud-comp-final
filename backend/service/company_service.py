from pydantic import BaseModel
class CreateCompanyDto(BaseModel):
    company_name: str
    company_address: str
    company_phone_number: str

class UpdateCompanyDto(BaseModel):
    company_name: str
    company_address: str
    company_phone_number: str

class UpdateOrderDto(BaseModel):
    order_number: str
    status: str

class CreateOrderDto(BaseModel):
    detail: str
    customer_name: str
    customer_address: str
    customer_phone_number: str


class CompanyService:
    def __init__(self,aws_service,mysql_connector):
        print("Initialized Company service")
        self.aws_service = aws_service
        self.mysql_connector = mysql_connector

    def get_company_from_user(self,user):
        df = self.mysql_connector.read_query_to_df(
            '''SELECT * FROM company WHERE company_email='{}'
            '''.format(user.email))
        return df.values.tolist()[0]
    
    def get_order(self,user):
        df = self.mysql_connector.read_query_to_df(
            '''SELECT * FROM customer_order co, company c WHERE c.company_id=co.company_id and c.company_email='{}'
            '''.format(user.email))
        if df.empty:
            return []
        return [
            {
            "order_number":x[0],
            "detail":x[1],
            "customer_name":x[2],
            "customer_address":x[3],
            "customer_phone_number":x[4],
            "status":x[5]
            } for x in df.values.tolist()]

    def insert_order(self, dto: CreateCompanyDto, user):
        res = self.mysql_connector.execute_query(
            '''SELECT company_id FROM company WHERE company_email='{}' 
            '''.format(user.email))
        self.mysql_connector.execute_query(
            '''INSERT INTO customer_order (detail, customer_name, customer_address, customer_phone_number, company_id, status)
            VALUES ('{}', '{}', '{}', '{}', '{}', 'ORDERED');
            '''.format(dto.detail, dto.customer_name, dto.customer_address, dto.customer_phone_number, res[0][0]))
        return dto

    def insert_company(self,dto: CreateOrderDto, user):
        self.mysql_connector.execute_query(
            '''INSERT INTO company (company_name, company_address, company_phone_number, company_email)
            VALUES ('{}', '{}', '{}', '{}');
            '''.format(dto.company_name, dto.company_address, dto.company_phone_number, user.email))
        return dto

    def update_company(self,dto: UpdateCompanyDto, user):
        self.mysql_connector.execute_query(
            '''INSERT INTO company (company_name, company_address, company_phone_number, company_email)
            VALUES ('{0}', '{1}', '{2}', '{3}') ON DUPLICATE KEY UPDATE company_name='{0}',company_address='{1}',company_phone_number='{2}';
            '''.format(dto.company_name, dto.company_address, dto.company_phone_number, user.email))
        return dto

    def update_order(self,dto: UpdateOrderDto, user):
        df = self.mysql_connector.read_query_to_df(
            '''SELECT co.order_number, co.detail, co.customer_name, co.customer_address, co.customer_phone_number, co.status 
            FROM company c , customer_order co WHERE c.company_id=co.company_id and c.company_email='{}' and co.order_number ='{}';
            '''.format(user.email,dto.order_number))
        if (not df.empty):
            self.mysql_connector.execute_query(
                '''INSERT INTO customer_order (order_number) VALUES ('{}') ON DUPLICATE KEY UPDATE status = '{}'
                '''.format(dto.order_number, dto.status))
            return dto
        return 'Cannot update , order_number does not match with company'

    
    def company_email_avail(self, email):
        df=self.mysql_connector.read_query_to_df(
        '''SELECT * FROM company WHERE company_email='{}';
        '''.format(email))
        if df.empty:
            return {'status':  True, 'email':email, 'company_name': '', 'company_address': '' , 'company_phone_number': ''}
        res = df.values.tolist()
        return {'status': False, 'email':email, 'company_name': res[0][1], 'company_address': res[0][2], 'company_phone_number':res[0][3] }
    
    def get_order_with_status(self,status, user):
        res=self.mysql_connector.read_query_to_df(
            '''SELECT co.order_number, co.detail, co.customer_name, co.customer_address, co.customer_phone_number, co.status 
            FROM company c , customer_order co WHERE c.company_id=co.company_id and co.status='{}' and c.company_email = '{}';
            '''.format(status,user.email))
        return [
            {
            "order_number":x[0],
            "detail":x[1],
            "customer_name":x[2],
            "customer_address":x[3],
            "customer_phone_number":x[4],
            "status":x[5]
            } for x in res.values.tolist()]
    def get_shipping_log(self,user):
        res = self.mysql_connector.execute_query(
            '''SELECT company_id FROM company WHERE company_email='{}' 
            '''.format(user.email))
        if not res:
            return []
        company_id = res[0][0]
        df = self.mysql_connector.read_query_to_df(
            '''SELECT co.order_number, customer_name, customer_phone_number, customer_address, detail, parcel_number, shipping_time
            FROM customer_order co INNER JOIN shipping_log sl
            ON co.order_number = sl.order_number WHERE co.company_id='{}';
            '''.format(company_id))
        return [
            {
                "order_number":x[0],
                "customer_name":x[1],
                "customer_phone_number":x[2],
                "customer_address":x[3],
                "detail":x[4],
                "parcel_number":x[5],
                "shipping_time":x[6]
            } for x in df.values.tolist()]
    def send_notification(self,dto,company_email):
        arr = dto.words
        df = self.mysql_connector.read_query_to_df(
            '''SELECT co.order_number, co.detail, co.customer_name, co.customer_address, co.customer_phone_number, co.status , c.company_name
            FROM company c , customer_order co WHERE c.company_id=co.company_id and co.status='PAID' and c.company_email='{}';
            '''.format(company_email))
        failed = []
        success = []
        for x in arr:
            try:
                rec = df[(df['order_number']==int(x['order_number']))][['customer_phone_number','company_name']].values.tolist()
                if (rec):
                    number = '+66' + rec[0][0][1:]
                    self.aws_service.send_message(number, 'Package sent from {}, parcel number: {}'.format(rec[0][-1],x['parcel_number']))
                    self.mysql_connector.execute_query(
                        '''INSERT INTO customer_order (order_number) VALUES ('{}') ON DUPLICATE KEY UPDATE status = 'SHIPPED'
                        '''.format(x['order_number']))

                    self.mysql_connector.execute_query(
                        '''INSERT INTO shipping_log (parcel_number, order_number, shipping_time) VALUES ('{}', '{}', NOW()) 
                        '''.format(x['parcel_number'],x['order_number']))

                    success.append(x)
                else:
                    x['reason']='order_number not matched'
                    failed.append(x)
                    print('Not matched', x)
            except Exception as e:
                x['reason']=str(e)
                failed.append(x)
        return {"success":success,"failed":failed}

