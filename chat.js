import { generateSign, reply, handleError} from './_utils.js';
import { ChatGPTUnofficialProxyAPI } from 'chatgpt'

// 从环境变量中获取到钉钉和 OpenAI 的相关配置
const DING_APP_SECRET = process.env.DING_APP_SECRET || '';
const OPENAI_KEY = process.env.OPENAI_KEY || '';
// 当前使用的是 OpenAI 开放的最新 GPT-3.5 模型，如果后续 GPT-4 的 API 发布，修改此处参数即可
// OpenAI models 参数列表 https://platform.openai.com/docs/models
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
const OPENAI_ACCESS_TOKEN = process.env.OPENAI_ACCESS_TOKEN || '';
const PROXY_URL = process.env.PROXY_URL || ''

// 主方法
async function CHAT(params) {

    // 打印请求参数到日志，方便排查
    //console.log('Received params:', params);

    const { msgtype, text } = params;

    //只支持文本消息
    if (msgtype !== 'text') {
        return reply(params, '目前仅支持文本格式的消息。');
    }

    // 如果都没有配置，则提醒需要配置
    if (!OPENAI_KEY && !OPENAI_ACCESS_TOKEN) {
        return reply(
            params,
            '请配置 OPENAI_KEY 或 OPENAI_ACCESS_TOKEN 环境变量，完成 ChatGPT 连接。'
        );
    }

    //如果配置了OPENAI_KEY就走这个
    if (OPENAI_KEY) {

    }
    //如果配置了OPENAI_ACCESS_TOKEN就走这个
    else if (OPENAI_ACCESS_TOKEN) {
        try{
        const api = new ChatGPTUnofficialProxyAPI({
            accessToken: OPENAI_ACCESS_TOKEN,
            apiReverseProxyUrl: PROXY_URL
        })
        console.log(text.content)
        const res = await api.sendMessage(text.content)
        return reply(params, res.text);
    }catch(e){
        console.log(e)
        return reply(params, "出错了,聊天中存在链接或其他原因。");
    }
    }

};

export { CHAT }