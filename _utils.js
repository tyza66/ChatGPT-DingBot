import crypto from  'crypto'
import axios from 'axios'

// 从环境变量中获取到钉钉的相关配置
const DING_APP_KEY = process.env.DING_APP_KEY || '';
const DING_APP_SECRET = process.env.DING_APP_SECRET || '';

// 辅助方法，用于根据钉钉的规则生成签名，校验消息合法性
function generateSign(timestamp) {
  const stringToSign = timestamp + '\n' + DING_APP_SECRET;
  const hmac = crypto.createHmac('sha256', DING_APP_SECRET);
  hmac.update(stringToSign);
  const sign = hmac.digest().toString('base64');
  return sign;
}

// 辅助方法，获取钉钉机器人的 AccessToken
async function getAccessToken() {
  if (!DING_APP_KEY || !DING_APP_SECRET) {
    throw new Error(
      '没有正确设置 DING_APP_KEY 和 DING_APP_SECRET 环境变量，请进入 AirCode 中完成设置。'
    );
  }

  // 先从数据库中获取 token 看下是否过期，这样不用每次都发起请求
  const TokenTable = aircode.db.table('token');
  const item = await TokenTable.where().sort({ expiredAt: -1 }).findOne();
  const now = Date.now();

  // 如果 token 还在有效期内，则直接返回
  if (item && item.expiredAt > now) {
    return item.token;
  }

  // 否则，请求钉钉获取 token
  const { data } = await axios.post(
    'https://api.dingtalk.com/v1.0/oauth2/accessToken',
    {
      appKey: DING_APP_KEY,
      appSecret: DING_APP_SECRET,
    }
  );

  const token = data.accessToken;
  const expiredAt = now + data.expireIn * 1000;

  // 将 token 存入数据库
  await TokenTable.save({ token, expiredAt });

  // 返回 token
  return token;
}

// 辅助方法，用于钉钉发送单聊消息
async function sendPrivateMessage(userId, content) {
  const token = await getAccessToken();
  return axios.post(
    'https://api.dingtalk.com/v1.0/robot/oToMessages/batchSend',
    {
      robotCode: DING_APP_KEY,
      userIds: [userId],
      msgKey: 'sampleText',
      msgParam: JSON.stringify({ content }),
    },
    {
      headers: {
        'x-acs-dingtalk-access-token': token,
      },
    }
  );
}

// 辅助方法，用于钉钉发送群聊消息
async function sendGroupMessage(conversationId, content) {
  const token = await getAccessToken();
  return axios.post(
    'https://api.dingtalk.com/v1.0/robot/groupMessages/send',
    {
      robotCode: DING_APP_KEY,
      openConversationId: conversationId,
      msgKey: 'sampleText',
      msgParam: JSON.stringify({ content }),
    },
    {
      headers: {
        'x-acs-dingtalk-access-token': token,
      },
    }
  );
}

// 辅助方法，回复用户的消息
async function reply(event, content) {
  // 如果没有配置钉钉的 Key 和 Secret，则通过直接返回的形式回复
  // 注意这种形式虽然简单，但可能因为超时而无法在钉钉中获得响应
  if (!DING_APP_KEY || !DING_APP_SECRET) {
    return {
      msgtype: 'text',
      text: { content },
    };
  }

  // 如果配置了 Key 和 Secret，则通过调用接口回复
  // 根据 conversationType 判断是群聊还是单聊
  if (event.conversationType === '1') {
    // 单聊
    await sendPrivateMessage(event.senderStaffId, content);
  } else {
    // 群聊
    await sendGroupMessage(event.conversationId, content);
  }
  return { ok: 1 };
}

// 辅助方法，处理错误，生成错误消息
function handleError(error) {
  let errorMessage;

  if (error.response) {
    // 如果有 error.response，代表请求发出了，而服务器回复了错误
    const { status, statusText, data } = error.response;

    if (status === 401) {
      // 401 代表 OpenAI 认证失败了
      errorMessage =
        '你没有配置正确的 OpenAI API Key，请进入 AirCode 中配置正确的环境变量。';
    } else if (data.error && data.error.message) {
      // 如果 OpenAI 返回了错误消息，则使用 OpenAI 的
      errorMessage = data.error.message;
    } else {
      // 否则，使用默认的错误消息
      errorMessage = `Request failed with status code ${status}: ${statusText}`;
    }
  } else if (error.request) {
    // 如果有 error.request，代表请求发出了，但没有得到服务器响应
    errorMessage =
      'OpenAI 服务器没有响应，可以前往 https://status.openai.com/ 查看其服务状态。';
  } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    // 网络错误，例如 DNS 解析错误或者建连失败
    errorMessage = `Network error: ${error.message}`;
  } else {
    errorMessage = error.message;
  }

  return errorMessage;
}

export {
  generateSign,
  reply,
  handleError,
};
