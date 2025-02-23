<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

数据库是 mysql + redis  
后端部分是 Nest + Prisma + Socket.io  
前端部分是 React + Ant Design  
minio 做 OSS 对象存储服务  
文档用 swagger 部署用  
docker compose + pm2

数据库表有 7 个：用户表 users、好友关系表 friendship、聊天室表 chatroom、用户所
在聊天室表 user_chatroom、聊天记录表 chat_history、好友申请表 friend_request、收
藏表 favorite。

模块有 6 个：用户模块、好友管理模块、聊天室管理模块、聊天模块、收藏管理模块、好
友请求管理模块。

接口路径 请求方式 描述  
/user/login POST 用户登录  
/user/register POST 用户注册  
/user/update POST 用户个人信息修改  
/user/update_password POST 用户修改密码

/friendship/add POST 添加好友  
/friendship/delete DELETE 删除好友  
/friendship/list GET 好友列表

/chatroom/join GET 加入聊天室  
/chatroom/exit GET 退出聊天室  
/chatroom/list GET 聊天室列表  
/chatroom/add POST 新建聊天室（单聊、群聊）

/chat WEBSOCKET 聊天

/favorite/add GET 添加收藏  
/favorite/delete DELETE 删除收藏  
/favorite/list GET 收藏列表

/friend_request/list GET 好友请求列表  
/friend_request/agree GET 同意好友请求  
/friend_request/reject GET 拒绝好友请求

## prisma

## redis

## email

nodemailer  
@types/nodemailer

## pino
