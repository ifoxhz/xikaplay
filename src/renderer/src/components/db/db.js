import Dexie from 'dexie'

export const db = new Dexie('bluelamp')

db.version(2).stores({
  User: '++id, name, email, p2paddress' // Primary key and indexed props
})

export async function setUser(user) {
  const id = await db.User.add({
    name: user.name,
    email: user.email,
    p2paddress:user.p2paddress
  })
  console.log('setUser', id)
}

export async function getAllUser() {
  return new Promise((resolve) => {
    db.User
      .toArray()
      .then((results) => {
        // 处理结果
        console.log("getAllUser function:",results)
        resolve([...results])
      })
      .catch((error) => {
        console.error('getAllUser:', error)
        resolve([])
      })
  })
}

db.version(1).stores({
  Messages: '++id, sendPeer,createTime,msgBody' // Primary key and indexed props
})

export async function writeMsg(msg) {
  const id = await db.User.add({
    seedPeer: msg.seedPeer,
    createTime: Date,
    msgBody: msg.msgBody
  })
  console.log('dexie msg', id)
}


export async function readMsg(starId) {
  return new Promise((resolve) => {
    db.Messages
      .where('id').above(starId)
      .toArray()
      .then((results) => {
        // 处理结果
        console.log(results)
        resolve(results)
      })
      .catch((error) => {
        console.error('读取值时出错:', error)
        resolve([])
      })
  })
}





// module.exports = {
//   setUser
// }
