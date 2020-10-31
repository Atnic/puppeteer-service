## Puppeteer Service

Serverless service for handling using Puppeteer Headless Chrome feature like screenshoot or PDF print.

#### Useful Documentations:
- [Puppeteer](https://pptr.dev/)

#### Local Installation

```
git clone https://github.com/atnic/puppeteer-service.git
cd puppeteer-service
npm install
```

Add `.env` file to setup REGION

#### Auto Deployment

- Config Github Secret repo to setup this, see `.env` file for references
    - `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY` for production
    - `AWS_ACCESS_KEY_ID_STAGING` & `AWS_SECRET_ACCESS_KEY_STAGING` for staging
    - `AWS_ACCESS_KEY_ID_DEV` & `AWS_SECRET_ACCESS_KEY_DEV` for dev
    - `AWS_REGION`
- After you setup secret
    - Commit to `main` branch will go to prod
    - Commit to `release/*` branch will go to staging
    - Commit to `develop` branch will go to dev

#### Manual Production Deployment

- Make sure you already have profile defined in `.aws/credentials` where you want to deploy to.
- **Make sure you're on `main` branch**
- Edit your `.env` to setup REGION
- Then run
```
serverless deploy --aws-profile [your-profile] --stage prod
```
- Don't forget to add it to your API Gateway if you use it.
