'use strict';

module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

const chromeLambda = require("chrome-aws-lambda");
const FileType = require("file-type");

async function downloadFonts() {
    try {
        await Promise.allSettled([
            chromeLambda.font('.fonts/NotoSansJapanese-Black.otf'),
            chromeLambda.font('.fonts/NotoSansJapanese-Bold.otf'),
            chromeLambda.font('.fonts/NotoSansJapanese-Light.otf'),
            chromeLambda.font('.fonts/NotoSansJapanese-Medium.otf'),
            chromeLambda.font('.fonts/NotoSansJapanese-Regular.otf'),
            chromeLambda.font('.fonts/NotoSansJapanese-Thin.otf')
        ]);
    } catch (e) {
        // Do nothing
    }
}

module.exports.pdf = async (event) => {
    const {
        url, options, emulate_media_type, goto_options, download
    } = event.queryStringParameters;

    await downloadFonts()
    const browser = await chromeLambda.puppeteer.launch({
        args: chromeLambda.args,
        executablePath: await chromeLambda.executablePath
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', ...((goto_options && JSON.parse(goto_options)) || {}) });
    const title = await page.title();
    if (emulate_media_type)
        await page.emulateMediaType(emulate_media_type);
    const data = await page.pdf(JSON.parse(options || '{}'));
    const fileType = (await FileType.fromBuffer(data));
    await browser.close();
    return {
        statusCode: 200,
        body: data.toString('base64'),
        isBase64Encoded: true,
        headers: {
            'Content-Type': (await FileType.fromBuffer(data)).mime,
            'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${title}.${fileType.ext}"`
        }
    };
};

module.exports.screenshot = async (event) => {
    const {
        url, options, goto_options, download
    } = event.queryStringParameters;

    await downloadFonts()
    const browser = await chromeLambda.puppeteer.launch({
        args: chromeLambda.args,
        executablePath: await chromeLambda.executablePath
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', ...((goto_options && JSON.parse(goto_options)) || {}) });
    const title = await page.title();
    let data = await page.screenshot(JSON.parse(options || '{}'));
    if (!data || typeof data === 'string')
        data = Buffer.from(data || '', 'utf8');
    const fileType = (await FileType.fromBuffer(data));
    await browser.close();
    return {
        statusCode: 200,
        body: data.toString('base64'),
        isBase64Encoded: true,
        headers: {
            'Content-Type': fileType.mime,
            'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${title}.${fileType.ext}"`
        }
    };
};
