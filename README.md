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

## 第一阶段

- [] 完成用户模块 登录、注册
- [] auth guard **当失败时怎样定制返回内容**
- [] 完成好友管理模块 添加好友
- [] 完成聊天室管理模块 新建聊天室、加入聊天室
- [] 完成聊天模块 聊天

## 第二阶段

- [] 完成收藏管理模块 添加收藏
- [] 完成好友请求管理模块 好友请求

## prisma

create  
findMany  
findManyBy  
findManyByRelation  
createMany  
updateMany  
deleteMany  
findUnique  
findFirst

- @relation()
- @@id()

## redis

## email

nodemailer  
@types/nodemailer

## pino

## JWT

@nestjs/jwt

## 用户模块

```prisma
model User {
  friends         Friendship[] @relation("userToFriend")
  inverseFrinends Friendship[] @relation("friendToUser")
}

model Friendship {
  user   User @relation("userToFriend", fields: [userId], references: [id])
  userId Int
  friend User @relation("friendToUser", fields: [friendId], references: [id])
  friendId Int
  @@id([userId, friendId])
}
```

好友关系就是用户和用户的多对多关联  
加入群聊就是往用户-聊天室的中间表插入一条记录  
friends 是 user 的好友有哪些。  
inverseFriends 是 user 是哪些人的好友
