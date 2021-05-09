# Ordersist
Ordersist is a cloud-base website which helps shop owners to manage their orders and its status. 
Shop owners can upload their parcel slip, Ordersist will extract parcel number from the image. 
Then Ordersist will notify customers via mobile message.
To implement this system, we need to setup cloud services following these instructions.
# Frontend Deployment Setup (AWS Amplify)
1. On AWS Amplify, click “Host web app”.
2. Connect to Github to link source code, then click “Continue”.
3. Choose the project, branch and folder, then click “Next”.
4. Change build code from yarn to npm.
5. Add environment variables in “Advanced Setting”, then click “Save and Deploy”.
6. After the verification process finished, the deployment process is done.
# Backend Deployment Setup (AWS EC2)
1. Launch EC2 free-tier instance with the Amazon-linux 2 AMI.
2. Configure everything to default setting, Just hit ‘Next’ until the Security Group Configure page appear (Step 6). 
3. Add inbound rule as shown below (Custom TCP, Port range 8000, Source from anywhere).
4. Hit Review and launch, Create a new key pair (or use an existing one as you prefer) and hit “Launch Instances”.
5. Click view instance (wait for the instance to be initialized).
6. SSH to your instance. 
7. Install git and docker using the following command.
```
sudo yum update -y
sudo yum install git -y
sudo amazon-linux-extras install docker
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo chkconfig docker on
sudo reboot
```
8. Reconnect to the instance, install docker-compose.
```
sudo curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```
9. Check the library.
```
docker -v
docker-compose -v
git -v
```
10. Clone repository from the github.
```
git clone https://github.com/peem5210/cloud-comp-final.git
cd cloud-comp-final
docker-compose up --build
docker-compose down
```
11. Create .env file in the directory cloud-comp-final/backend with configure below.
```
AWS_ACCESS_KEY=[Your IAM role access key ID]
AWS_SECRET_ACCESS_KEY=[Your IAM role secret key ID]
MYSQL_HOSTNAME=[Your Database Hostname]
MYSQL_USERNAME=[Your Database Username]
MYSQL_PASSWORD=[Your Database Password]
MYSQL_DATABASE=[Your Database Name]
AUTH0_DOMAIN=[Your Tenant]
AUTH0_AUDIENCE=[Your Audience]
```
12. Backend is now ready with the Public IPv4 of the instance with port 8000 but will not ready to use by AWS Amplify web application because of the http protocol which we will add https protocol to solve this problem in the next step.
13. Create the application load balancer and assign to the instance.
14. Request a new certificate from ACM if have not done before.
15. Select the instance’s security group.
16. Register instance to the load balancer.
17. Once the load balancer is active, add dns record to your domain name. 
18. The backend is now ready with HTTPS protocol and can be used by amplify application.
# Database Setup
1. Click “Create Database”.
2. Choose “Standard create” and “MySQL”.
3. Choose “Free tier” templates.
4. Choose database name and create admin username with auto-generated password.
5. Since this is only mockup project, turn off auto-scaling, then click “Create database”.
6. Edit Inbound security group.
# AWS Rekognition and SNS Setup
1. Create IAM role in your amazon account.
2. Attach the following policy: AmazonS3FullAccess, AmazonRekognitionFullAccess and AmazonSNSFullAccess.
3. Save the access key ID and secret access key ID to be set in the .env file.
4. Your AWS Rekognition Service and SNS is now ready.
# Auth0 Setup
1. Create your Auth0 tenant.
2. Create new API.
3. Add the following permissions to your API.
4. Create your application.
5. Save the following field to be set in frontend environment.
6. Add “Add email to access token”rule with the following configuration.
7. Your Auth0 service is now ready.

