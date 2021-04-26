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

    def insert_company(self,dto: CreateCompanyDto, user):
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
    
    def get_order_with_status(self,status):
        res=self.mysql_connector.read_query_to_df(
            '''SELECT co.order_number, co.detail, co.customer_name, co.customer_address, co.customer_phone_number, co.status 
            FROM company c , customer_order co WHERE c.company_id=co.company_id and co.status='{}';
            '''.format(status))
        return [
            {
            "order_number":x[0],
            "detail":x[1],
            "customer_name":x[2],
            "customer_address":x[3],
            "customer_phone_number":x[4],
            "status":x[5]
            } for x in res.values.tolist()]
    def send_notification(self,dto,company_email):
        arr = dto.words
        df = self.mysql_connector.read_query_to_df(
            '''SELECT co.order_number, co.detail, co.customer_name, co.customer_address, co.customer_phone_number, co.status 
            FROM company c , customer_order co WHERE c.company_id=co.company_id and co.status='PAID' and c.company_email='{}';
            '''.format(company_email))
        failed = []
        success = []
        for x in arr:
            try:
                rec = df[(df['order_number']==int(x['order_number']))][['customer_phone_number']].values.tolist()
                if (rec):
                    number = '+66' + rec[0][0][1:]
                    self.aws_service.send_message(number, 'Package sent, parcel number: {}'.format(x['parcel_number']))
                    self.mysql_connector.execute_query(
                        '''INSERT INTO customer_order (order_number) VALUES ('{}') ON DUPLICATE KEY UPDATE status = 'SHIPPED'
                        '''.format(x['order_number']))
                    success.append(x)
                else:
                    x['reason']='order_number not matched'
                    failed.append(x)
                    print('Not matched', x)
            except Exception as e:
                x['reason']=str(e)
                failed.append(x)
        return {"success":success,"failed":failed}

