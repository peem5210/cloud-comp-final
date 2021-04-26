from pydantic import BaseModel
class CreateCompanyDto(BaseModel):
    company_name: str
    company_address: str
    company_phone_number: str


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

    def insert_company(self,dto: CreateCompanyDto, user):
        self.mysql_connector.execute_query(
            '''INSERT INTO company (company_name, company_address, company_phone_number, company_email)
            VALUES ('{}', '{}', '{}', '{}');
            '''.format(dto.company_name, dto.company_address, dto.company_phone_number, user.email))
        return dto
    
    def company_email_avail(self, email):
        res=self.mysql_connector.execute_query(
        '''SELECT COUNT(*) FROM company WHERE company_email='{}';
        '''.format(email))
        return {'status': not res[0][0] > 0, 'email':email}
    
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

