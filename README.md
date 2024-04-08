# ChatGPT-DingBot
### ChatGPT钉钉机器人
#### 一、说明
- 一个用来将正版ChatGPT语言模型（OpenAI）聊天转换成钉钉企业应用机器人的程序
- 目前只支持免费模式（使用OPENAI_ACCESS_TOKEN），支持使用OPENAI_KEY的付费模式
- 同时配置了俩东西的话，APIKey优先级更高
- 回答支持MarkDown语法
- 支持自定义代理聊天源
- 支持群聊和单聊
- 支持Docker部署
- 默认启动在3000端口（可以自行修改）
<details><summary>电脑版效果</summary>
<img src="./images/1.png"/>
</details>
<details><summary>手机版效果</summary>
<img src="./images/2.jpg"/>
</details>

#### 二、环境要求
- Node18直接可以运行（直接修改代码中的必要信息之后直接使用node启动index.js）（不一定非得是Node18只是我使用Node18写的别的Node版本没试过）
- 可使用Docker运行（直接使用代码中提供的DockerFile打包，之后携带环境变量启动容器）

#### 三、环境变量（自行搭配以达到可运行即可）
- DING_APP_KEY（钉钉机器人的AK）
- DING_APP_SECRET（钉钉机器人的AS）
- OPENAI_ACCESS_TOKEN（OPENAI登录状态的AccessToken）
- PROXY_URL（如果时API模式可以表示为代理的基础地址）
- OPENAI_API_KEY（就是对应基础地址可用的API_KEY，当然可以是官方的）
- OPENAI_MODEL（模型名称，默认不写就是gpt-3.5-turbo）
  
#### 四、非必要环境变量
- SERVER_PORT（默认3000）

#### 五、演示启动指令
```
node index.js
```

```
docker run -d -p 3096:3000 -e DING_APP_KEY=你的钉钉AppKey -e DING_APP_SECRET=你的钉钉AppSecret -e OPENAI_ACCESS_TOKEN=你的OPENAI_ACCESS_TOKEN -e PROXY_URL=你的代理源地址 chatgptdingbot:1.2
```

#### 六、接口文档
- /test（GET） 测试是否启动
- /chat（POST） 聊天接口（就是映射到外网之后填进钉钉消息接收地址里的地址）

#### 七、请求地址
- Token获取地址：https://chat.openai.com/api/auth/session

#### 八、相关项目
- https://github.com/transitive-bullshit/chatgpt-api
- https://github.com/PawanOsman/ChatGPT
- 潘多拉

By:tyza66
