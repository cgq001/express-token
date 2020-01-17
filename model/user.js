//数据库配置
const db= require('../config/db')

const fn={

	//注册用户  无返回值
   addUser: async function(data){
			let sql ="insert into user(username,password,email) values(?,?,?)"
			let arr =[]
				arr.push(data.username)
				arr.push(data.password)
				arr.push(data.email)

			return await db.query(sql,arr)

	},

	// 登录
	loadUser:async function(data){
		let sql ="select * from user where email=?"
		let arr=[]
			arr.push(data)

		
		return new Promise((resolve,reject)=>{
           db.query(sql,arr,function(data,err){
                resolve(data)
            })
        })
		// return await db.query(sql,arr)
	},
	// 获取好友列表  有返回值
	getUserlist:async function(id){
		let sql ="select a.*, b.*,a.id as user_id from contacts a inner join user b on a.userlistid = b.id where userid=?"
		let arr=[]
			arr.push(id)
		return new Promise((resolve,reject)=>{
           db.query(sql,arr,function(data,err){
                resolve(data)
            })
        })
	}
}

module.exports = fn;
