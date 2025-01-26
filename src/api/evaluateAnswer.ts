// curl -X POST 'https://api.coze.cn/v3/chat?' \
// -H "Authorization: Bearer pat_Z3gRSIGKmEvitWzWsSU4wrSrcouP7hPecyiiYvvgTPeDndbq9FcrWtdxS56tAimd" \
// -H "Content-Type: application/json" \
// -d '{
//   "bot_id": "7463900937334456355",
//   "user_id": "sanjin",
//   "additional_messages": [
//     {
//       "content": "题目：答案：",
//       "content_type": "text",
//       "role": "user"
//     }
//   ]
// }'
// response:

// id : 7463921338206650418
// conversation_id : 7463921338206634034
// bot_id : 7463900937334456355
// created_at : 1737829616
// last_error {2}
// code : 0
// msg : ""
// status : in_progress
// code : 0
// msg : ""

//查看对话详情
// 查看对话的详细信息。
// 在非流式会话场景中，调用发起对话接口后，可以先轮询此 API 确认本轮对话已结束（status=completed），再调用接口查看对话消息详情查看本轮对话的模型回复。
// 仅在对话开启了保存历史记录（auto_save_history=true）后，可通过此接口查看对话的详细信息。
// 建议每秒最多调用 1 次此接口，否则可能触发接口限流。
// curl -X GET 'https://api.coze.cn/v3/chat/retrieve?conversation_id=xx&chat_id=xx&' \
// -H "Authorization: Bearer pat_Z3gRSIGKmEvitWzWsSU4wrSrcouP7hPecyiiYvvgTPeDndbq9FcrWtdxS56tAimd" \
// -H "Content-Type: application/json"
// response:
// {"code":0,"data":[{"bot_id":"7463900937334456355","chat_id":"7463921338206650418","content":"- 👍 优点：\n    - 完整地列出了 TCP/IP 网络模型的四层，即应用层、传输层、网络层和数据链路层。\n    - 对应用层中常见的协议（HTTP、DNS、SMTP 等）进行了详细解释，说明了这些协议在消息传输中的作用和格式设置。\n    - 清晰地指出了传输层的两种主要协议（UDP 和 TCP）以及它们各自的优缺点。\n- 👎 不足：\n    - 没有对网络层（如 IP 协议）和数据链路层（如 MAC 地址、以太网协议等）进行详细说明。\n- 💡 建议：\n    - 补充对网络层中 IP 协议的功能（如 IP 地址分配、路由选择等）和数据链路层中 MAC 地址的作用、以太网协议的工作原理等内容的介绍，使对 TCP/IP 网络模型各层的阐述更加完整和全面。","content_type":"text","conversation_id":"7463921338206634034","created_at":1737829616,"id":"7463921338206666802","role":"assistant","type":"answer","updated_at":1737829622},{"bot_id":"7463900937334456355","chat_id":"7463921338206650418","content":"{\"msg_type\":\"generate_answer_finish\",\"data\":\"{\\\"finish_reason\\\":0,\\\"FinData\\\":\\\"\\\"}\",\"from_module\":null,\"from_unit\":null}","content_type":"text","conversation_id":"7463921338206634034","created_at":1737829624,"id":"7463921377951727626","role":"assistant","type":"verbose","updated_at":1737829623},{"bot_id":"7463900937334456355","chat_id":"7463921338206650418","content":"详细介绍一下IP地址分配的过程","content_type":"text","conversation_id":"7463921338206634034","created_at":1737829624,"id":"7463921377951744010","role":"assistant","type":"follow_up","updated_at":1737829623},{"bot_id":"7463900937334456355","chat_id":"7463921338206650418","content":"举例说明IP协议的路由选择过程","content_type":"text","conversation_id":"7463921338206634034","created_at":1737829624,"id":"7463921377951760394","role":"assistant","type":"follow_up","updated_at":1737829623},{"bot_id":"7463900937334456355","chat_id":"7463921338206650418","content":"如何确保TCP连接的可靠性？","content_type":"text","conversation_id":"7463921338206634034","created_at":1737829624,"id":"7463921377951776778","role":"assistant","type":"follow_up","updated_at":1737829623}],"msg":""}

//查看对话消息详情
//查看指定对话中除 Query 以外的其他消息，包括模型回复、智能体执行的中间结果等消息。
// 查看消息列表 API 与查看对话消息详情 API 的区别在于：
// 查看消息列表 API 用于查询指定会话（conversation）中的所有消息，不仅包括开发者在会话中手动插入的每一条消息，也包括用户的每一次 Query、智能体的每一次回复。
// 查看对话消息详情 API 通常用于非流式对话场景中，查看某次对话（chat）中 type=answer 的智能体回复及 type=follow-up 等类型的对话中间态消息。
// 调用此 API 之前，建议先以每秒最多 1 次的频率轮询 查看对话详情 API 确认本轮对话已结束（status=completed），否则调用此 API 时获取到的消息内容可能不完整。
// curl -X GET 'https://api.coze.cn/v3/chat/message/list?conversation_id=7463921338206634034&chat_id=7463921338206650418&' \
// -H "Authorization: Bearer pat_Z3gRSIGKmEvitWzWsSU4wrSrcouP7hPecyiiYvvgTPeDndbq9FcrWtdxS56tAimd" \
// -H "Content-Type: application/json"
// response:
// {"code":0,"data":[{"bot_id":"7463900937334456355","chat_id":"7463921338206650418","content":"- 👍 优点：\n    - 完整地列出了 TCP/IP 网络模型的四层，即应用层、传输层、网络层和数据链路层。\n    - 对应用层中常见的协议（HTTP、DNS、SMTP 等）进行了详细解释，说明了这些协议在消息传输中的作用和格式设置。\n    - 清晰地指出了传输层的两种主要协议（UDP 和 TCP）以及它们各自的优缺点。\n- 👎 不足：\n    - 没有对网络层（如 IP 协议）和数据链路层（如 MAC 地址、以太网协议等）进行详细说明。\n- 💡 建议：\n    - 补充对网络层中 IP 协议的功能（如 IP 地址分配、路由选择等）和数据链路层中 MAC 地址的作用、以太网协议的工作原理等内容的介绍，使对 TCP/IP 网络模型各层的阐述更加完整和全面。","content_type":"text","conversation_id":"7463921338206634034","created_at":1737829616,"id":"7463921338206666802","role":"assistant","type":"answer","updated_at":1737829622},{"bot_id":"7463900937334456355","chat_id":"7463921338206650418","content":"{\"msg_type\":\"generate_answer_finish\",\"data\":\"{\\\"finish_reason\\\":0,\\\"FinData\\\":\\\"\\\"}\",\"from_module\":null,\"from_unit\":null}","content_type":"text","conversation_id":"7463921338206634034","created_at":1737829624,"id":"7463921377951727626","role":"assistant","type":"verbose","updated_at":1737829623},{"bot_id":"7463900937334456355","chat_id":"7463921338206650418","content":"详细介绍一下IP地址分配的过程","content_type":"text","conversation_id":"7463921338206634034","created_at":1737829624,"id":"7463921377951744010","role":"assistant","type":"follow_up","updated_at":1737829623},{"bot_id":"7463900937334456355","chat_id":"7463921338206650418","content":"举例说明IP协议的路由选择过程","content_type":"text","conversation_id":"7463921338206634034","created_at":1737829624,"id":"7463921377951760394","role":"assistant","type":"follow_up","updated_at":1737829623},{"bot_id":"7463900937334456355","chat_id":"7463921338206650418","content":"如何确保TCP连接的可靠性？","content_type":"text","conversation_id":"7463921338206634034","created_at":1737829624,"id":"7463921377951776778","role":"assistant","type":"follow_up","updated_at":1737829623}],"msg":""}

const API_URL = 'https://api.coze.cn/v3/chat';  // 替换为实际的 AI 模型 API 地址

const API_KEY = 'pat_Z3gRSIGKmEvitWzWsSU4wrSrcouP7hPecyiiYvvgTPeDndbq9FcrWtdxS56tAimd';

export const getResponseFromOpenAI = async (question: string, answer: string) => {
    try {
        // 使用fetch
        const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                        bot_id: '7463900937334456355',
                        user_id: 'sanjin',
                        additional_messages: [
                                {
                                        content: `题目：${question}\n答案：${answer}`,
                                        content_type: 'text',
                                        role: 'user'
                                }
                        ]
                })
        });
        const data = await response.json();
        console.log(data);
        // 获取data中的id, conversation_id
        const id = data.data.id;
        const conversation_id = data.data.conversation_id;
        console.log(id, conversation_id);
        // 查看对话详情, 通过轮询查看status是否为completed，每秒一次
        let status = 'in_progress';
        while (status !== 'completed') {
                const detailResponse = await fetch(`https://api.coze.cn/v3/chat/retrieve?conversation_id=${conversation_id}&chat_id=${id}`, {
                        method: 'GET',
                        headers: {
                                'Authorization': `Bearer ${API_KEY}`,
                                'Content-Type': 'application/json'
                        }
                });
                const detailData = await detailResponse.json();
                status = detailData.data.status;
                console.log(detailData.data);
                // 休眠1秒
                await new Promise(resolve => setTimeout(resolve, 1000));
        }
        // 获取对话消息详情
        const messageResponse = await fetch(`https://api.coze.cn/v3/chat/message/list?conversation_id=${conversation_id}&chat_id=${id}`, {
                method: 'GET',
                headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json'
                }
        });
        const messageData = await messageResponse.json();
        console.log(messageData);
        // 获取回答
        const answerMessage = messageData.data.find(item => item.type === 'answer');
        return answerMessage ? answerMessage.content : 'No answer found';
    } catch (error) {
        console.error('Error fetching response from OpenAI:', error);
        throw new Error('无法获取响应，请稍后再试。');
    }
};