from flask import *
from dotenv import load_dotenv, find_dotenv
import os
import urllib.request 
import urllib.parse
import json
import mysql.connector
import string,random
import datetime
from mysql.connector import pooling
from flask_socketio import SocketIO
from flask_socketio import send, emit
import socketio
import requests



#load .env
load_dotenv(find_dotenv())
#mysql.connector
connect_pool=pooling.MySQLConnectionPool(
	pool_name="injoy_pool",
	pool_size=5,
	pool_reset_session=True,
	host=os.getenv('MYSQL_DB_HOST'),
	database=os.getenv('MYSQL_DB_NAME'),
	user=os.getenv('MYSQL_USER'),
	password=os.getenv('MYSQL_PASSWORD')
	)


app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.secret_key = os.getenv('Session_secret_key')
sio = socketio.Client()
socketio = SocketIO(app)
async_mode='threading'

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/test")
def test():
	return render_template("test.html")
@app.route("/schedule/<id>")
def schedule(id):
	return render_template("schedule.html")

@app.route("/api/inviteMember",methods=["POST","DELETE"])
def inviteMemberAPI():
    if request.method=="POST":
        inviteData=json.loads(request.data.decode('utf-8'))
        inviteMail=inviteData["mail"]
        connection=connect_pool.get_connection()
        cursor=connection.cursor()
        cursor.execute("select * from injoy.member where email=%s",[inviteMail])
        memberData=cursor.fetchone()
        connection.close()
        if memberData!=None:
            connection=connect_pool.get_connection()
            cursor=connection.cursor()
            cursor.execute("insert into injoy.groupemail (groupId,email) values (%s,%s) ",[inviteData["groupId"],inviteMail])
            connection.commit()
            connection.close()
            return {"message":"邀請成功"}
        else:
            return {"message":"查無此會員"}
    elif request.method=="DELETE":
        deleteMemberData=json.loads(request.data.decode('utf-8'))
        connection=connect_pool.get_connection()
        cursor=connection.cursor()
        cursor.execute("delete from injoy.groupemail where groupId=%s and email=%s",[deleteMemberData["groupId"],deleteMemberData["mail"]])
        connection.commit()
        connection.close()
        return {"message":"已刪除此會員權限"}
    else:
        return {"message":"request方式出錯"}


@app.route("/api/addgroup",methods=["POST","DELETE"])
def addgroupAPI():
    if request.method=="POST":
        member=session.get("member")
        groupId=''.join(random.sample(string.ascii_letters+string.digits, 10))
        scheduleId=''.join(random.sample(string.ascii_letters+string.digits, 10))
        Today=datetime.date.today()
        connection=connect_pool.get_connection()
        cursor=connection.cursor()
        cursor.execute("insert into injoy.group (groupId,groupName) values (%s,%s) ",[groupId,"看板名稱"])
        cursor.execute("insert into injoy.groupemail (groupId,email) values (%s,%s) ",[groupId,member])
        cursor.execute("insert into injoy.trip (groupId,place,date,scheduleId) values (%s,%s,%s,%s) ",[groupId,"台北",Today,scheduleId])
        connection.commit()
        connection.close()
        return {"groupId":groupId}
    elif request.method=="DELETE":
        deleteData=json.loads(request.data.decode('utf-8'))
        groupId=deleteData["groupId"]
        connection=connect_pool.get_connection()
        cursor=connection.cursor()
        cursor.execute("DELETE injoy.trip,injoy.schedule FROM injoy.trip LEFT JOIN injoy.schedule ON injoy.trip.scheduleId=injoy.schedule.scheduleId WHERE injoy.trip.groupId=%s",[groupId])
        cursor.execute("DELETE FROM injoy.groupemail WHERE groupId=%s",[groupId])
        cursor.execute("DELETE FROM injoy.group WHERE groupId=%s",[groupId])
        connection.commit()
        connection.close()
        return {"message":"行程成功刪除"}
    else:
        {"message":"系統發生錯誤"}



@app.route("/api/addcard",methods=["POST","DELETE"])
def addcardAPI():
    if request.method=="POST":
        addcardData=json.loads(request.data.decode('utf-8'))
        scheduleId=''.join(random.sample(string.ascii_letters+string.digits, 10))
        # connection=connect_pool.get_connection()
        # cursor=connection.cursor()
        # cursor.execute("select scheduleId from injoy.trip where scheduleId=%s",[scheduleId])
        # checkData=cursor.fetchone()
        # connection.close()
        # 新增行程置資料庫
        connection=connect_pool.get_connection()
        cursor=connection.cursor()
        cursor.execute("insert into injoy.trip (groupId,place,date,scheduleId) values (%s,%s,%s,%s) ",[addcardData["groupId"],addcardData["place"],addcardData["date"],scheduleId])
        connection.commit()
        connection.close()
        return {"data":{"place":addcardData["place"] ,"date":addcardData["date"],"groupId":addcardData["groupId"],"scheduleId":scheduleId}}
    elif request.method=="DELETE":
        deletecardData=json.loads(request.data.decode('utf-8'))
        print(deletecardData)
        connection=connect_pool.get_connection()
        cursor=connection.cursor()
        cursor.execute("DELETE FROM injoy.trip WHERE scheduleId=%s",[deletecardData["scheduleId"]])
        cursor.execute("DELETE FROM injoy.schedule WHERE scheduleId=%s",[deletecardData["scheduleId"]])
        connection.commit()
        connection.close()
        return {"message":"行程成功刪除"}

def weatherAPI(cardPlace,cardDate):
    if cardPlace=="宜蘭" or cardPlace=="宜蘭縣" :
        locationId="F-D0047-003"
    elif cardPlace=="桃園" or cardPlace=="桃園市" :
        locationId="F-D0047-007"
    elif cardPlace=="新竹" or cardPlace=="新竹縣" :
        locationId="F-D0047-011"
    elif cardPlace=="苗栗" or cardPlace=="苗栗縣" :
        locationId="F-D0047-015"
    elif cardPlace=="彰化" or cardPlace=="彰化縣" :
        locationId="F-D0047-019"
    elif cardPlace=="南投" or cardPlace=="南投縣" :
        locationId="F-D0047-023"
    elif cardPlace=="雲林" or cardPlace=="雲林縣" :
        locationId="F-D0047-027"
    elif cardPlace=="嘉義" or cardPlace=="嘉義縣" :
        locationId="F-D0047-031"
    elif cardPlace=="屏東" or cardPlace=="屏東縣" :
        locationId="F-D0047-035"
    elif cardPlace=="臺東" or cardPlace=="臺東縣" or cardPlace=="台東" or cardPlace=="台東縣":
        locationId="F-D0047-039"
    elif cardPlace=="花蓮" or cardPlace=="花蓮縣":
        locationId="F-D0047-043"
    elif cardPlace=="澎湖" or cardPlace=="澎湖縣":
        locationId="F-D0047-047"
    elif cardPlace=="基隆" or cardPlace=="基隆市":
        locationId="F-D0047-051"
    elif cardPlace=="新竹" or cardPlace=="新竹市":
        locationId="F-D0047-055"
    elif cardPlace=="嘉義" or cardPlace=="嘉義市":
        locationId="F-D0047-059"
    elif cardPlace=="臺北" or cardPlace=="臺北市" or cardPlace=="台北" or cardPlace=="台北市" :
        locationId="F-D0047-063"
    elif cardPlace=="高雄" or cardPlace=="高雄市" :
        locationId="F-D0047-067"
    elif cardPlace=="新北" or cardPlace=="新北市" :
        locationId="F-D0047-071"
    elif cardPlace=="臺中" or cardPlace=="臺中市" or cardPlace=="台中" or cardPlace=="台中市" :
        locationId="F-D0047-075"
    elif cardPlace=="臺南" or cardPlace=="臺南市" or cardPlace=="台南" or cardPlace=="台南市" :
        locationId="F-D0047-079"
    elif cardPlace=="連江" or cardPlace=="連江縣" :
        locationId="F-D0047-083"
    elif cardPlace=="金門" or cardPlace=="金門縣" :
        locationId="F-D0047-087"
    else:
        locationId=None
    if locationId!=None:
        weatherPassword=os.getenv('WEATHER_PASSWORD')
        url="https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-093?Authorization="+weatherPassword+"&limit=1&format=JSON&locationId="+locationId+"&elementName=Wx&timeFrom="+cardDate+"T00%3A00%3A00"
        access_token = requests.get(url)
    return access_token

@app.route("/api/schedule/<scheduleId>",methods=["GET","POST"])
def scheduleAPI(scheduleId):
	# try:
    if request.method=="GET":
        # 抓群組資料
        memberEmail=session.get("member")
        connection=connect_pool.get_connection()
        cursor=connection.cursor()
        cursor.execute("SELECT injoy.group.id,injoy.group.groupId,injoy.group.groupName,injoy.chatroom.email,injoy.chatroom.content,injoy.chatroom.time FROM injoy.group LEFT JOIN injoy.chatroom ON injoy.group.groupId=injoy.chatroom.groupId WHERE injoy.group.groupId=%s ORDER BY injoy.chatroom.time ;",[scheduleId])
        groupData=cursor.fetchall()
        connection.close()
        chatroomLen=len(groupData)
        chatroomData=[]
        n=0
        while n<chatroomLen:
            chatroomData.append((groupData[n][3],groupData[n][4],groupData[n][5]))
            n+=1

        if groupData!=None:
            connection=connect_pool.get_connection()
            cursor=connection.cursor()
            # 抓日期時間
            cursor.execute("SELECT injoy.trip.id,injoy.trip.groupId,injoy.trip.place,injoy.trip.date,injoy.trip.scheduleId,injoy.schedule.time,injoy.schedule.content FROM injoy.trip LEFT JOIN injoy.schedule ON injoy.trip.scheduleId=injoy.schedule.scheduleId WHERE injoy.trip.groupId=%s ORDER BY injoy.trip.date ",[scheduleId])
            tripData=cursor.fetchall()
            # 抓取email
            cursor.execute("SELECT injoy.groupemail.groupId,injoy.groupemail.email,injoy.member.name FROM injoy.groupemail LEFT JOIN injoy.member ON injoy.groupemail.email=injoy.member.email WHERE injoy.groupemail.groupId=%s;",[scheduleId])
            mailData=cursor.fetchall()
            connection.close()
            memberCount=len(mailData)
            group_memberData={}
            group_email=[]
            n=0
            while n<memberCount:
                group_memberData[mailData[n][1]]=mailData[n][2]
                group_email.append(mailData[n][1])
                n+=1
            databaseNumber=len(tripData)
            if memberEmail in group_email:
                dataDict={}
                # 是否有schedule資料
                if tripData!=None:
                    n=0
                    schedule={}
                    scheduleId=[]
                    # scheduleId.append(tripData[0][4])
                    schedule_id=tripData[0][4]
                    dataDict={
                        "id":int(groupData[0][0]),
                        "groupId":groupData[0][1],
                        "groupName":groupData[0][2],
                        "email":group_email,
                        "scheduleId":scheduleId,
                        "member":group_memberData,
                        "chatroomData":chatroomData
                    } 
                    # 將 schedule 放入字典
                    while n<len(tripData):
                        if schedule_id==tripData[n][4]:
                            if tripData[n][5]==None or tripData[n][6]==None :
                                if schedule_id not in scheduleId:
                                    schedule={}
                                    schedule["date"]=tripData[n][3]
                                    schedule["place"]=tripData[n][2]
                                    scheduleId.append(tripData[n][4])
                                    # 天氣API
                                    cardDate=tripData[n][3]
                                    Today=str(datetime.date.today())
                                    cardMonth=int(cardDate[5:7])
                                    TodayMonth=int(Today[5:7])
                                    cardDay=int(cardDate[8:])
                                    TodayDay=int(Today[8:])
                                    cardPlace=tripData[n][2]
                                    if cardMonth==TodayMonth:
                                        if 0<=cardDay-TodayDay<7:
                                            access_token=weatherAPI(cardPlace,cardDate)  
                                            weather=access_token.json()["records"]["locations"][0]["location"][0]["weatherElement"][0]["time"][0]["elementValue"][0]["value"]
                                            schedule["weather"]=weather       
                                            locationId=None                          
                                        dataDict[tripData[n][4]]=schedule         
                                n+=1
                            else:
                                # 天氣API
                                cardDate=tripData[n][3]
                                Today=str(datetime.date.today())
                                cardMonth=int(cardDate[5:7])
                                TodayMonth=int(Today[5:7])
                                cardDay=int(cardDate[8:])
                                TodayDay=int(Today[8:])

                                if cardMonth==TodayMonth:
                                    if 0<=cardDay-TodayDay<7:
                                        cardPlace=tripData[n][2]
                                        access_token=weatherAPI(cardPlace,cardDate)  
                                        weather=access_token.json()["records"]["locations"][0]["location"][0]["weatherElement"][0]["time"][0]["elementValue"][0]["value"]
                                        schedule["weather"]=weather       
                                        locationId=None                       
                                schedule[tripData[n][5]]=tripData[n][6]
                                if (n+1)==len(tripData):
                                    scheduleId.append(tripData[n][4])
                                    schedule["date"]=tripData[n][3]
                                    schedule["place"]=tripData[n][2]
                                    dataDict[tripData[n][4]]=schedule
                                n+=1
                        else:     
                            if schedule_id not in scheduleId:
                                scheduleId.append(tripData[n-1][4])
                                schedule["date"]=tripData[n-1][3]
                                schedule["place"]=tripData[n-1][2]
                                schedule[tripData[n-1][5]]=tripData[n-1][6]
                                # 天氣API
                                cardDate=tripData[n-1][3]
                                Today=str(datetime.date.today())
                                cardMonth=int(cardDate[5:7])
                                TodayMonth=int(Today[5:7])
                                cardDay=int(cardDate[8:])
                                TodayDay=int(Today[8:])

                                if cardMonth==TodayMonth:
                                    if 0<=cardDay-TodayDay<7:
                                        cardPlace=tripData[n][2]
                                        access_token=weatherAPI(cardPlace,cardDate)  
                                        weather=access_token.json()["records"]["locations"][0]["location"][0]["weatherElement"][0]["time"][0]["elementValue"][0]["value"]
                                        schedule["weather"]=weather       
                                        locationId=None                       
                                elif cardMonth-TodayMonth==1:
                                    if 0<=cardDay-TodayDay+31<7:
                                        cardPlace=tripData[n-1][2]
                                        access_token=weatherAPI(cardPlace,cardDate)  
                                        weather=access_token.json()["records"]["locations"][0]["location"][0]["weatherElement"][0]["time"][0]["elementValue"][0]["value"]
                                        schedule["weather"]=weather       
                                        locationId=None                       
                            
                                dataDict[tripData[n-1][4]]=schedule

                            schedule={}
                            schedule_id=tripData[n][4]
                            scheduleId.append(tripData[n][4])
                            schedule["date"]=tripData[n][3]
                            schedule["place"]=tripData[n][2]
                            # 天氣API
                            cardDate=tripData[n][3]
                            Today=str(datetime.date.today())
                            cardMonth=int(cardDate[5:7])
                            TodayMonth=int(Today[5:7])
                            cardDay=int(cardDate[8:])
                            TodayDay=int(Today[8:])

                            if cardMonth==TodayMonth:
                                if 0<=cardDay-TodayDay<7:
                                    cardPlace=tripData[n][2]
                                    access_token=weatherAPI(cardPlace,cardDate)  
                                    weather=access_token.json()["records"]["locations"][0]["location"][0]["weatherElement"][0]["time"][0]["elementValue"][0]["value"]
                                    schedule["weather"]=weather       
                                    locationId=None                       
                            elif cardMonth-TodayMonth==1:
                                if 0<=cardDay-TodayDay+31<7:
                                    cardPlace=tripData[n][2]
                                    access_token=weatherAPI(cardPlace,cardDate)  
                                    weather=access_token.json()["records"]["locations"][0]["location"][0]["weatherElement"][0]["time"][0]["elementValue"][0]["value"]
                                    schedule["weather"]=weather       
                                    locationId=None                       
                            
                            if tripData[n][5]!=None or tripData[n][6]!=None :
                                schedule[tripData[n][5]]=tripData[n][6]
                            dataDict[tripData[n][4]]=schedule

                            n+=1
                    return {"data":dataDict}	
                else:
                    dataDict={
                            "id":int(groupData[0][0]),
                            "groupId":groupData[0][1],
                            "groupName":groupData[0][2],
                            "email":groupData[0][3]
                        } 
                    return {"data":dataDict}	
            else:
                return {"data":"無權限觀看此看板"}
        else:
            return {"data":"此看板不存在"} 
    elif request.method=="POST":
        saveData=json.loads(request.data.decode('utf-8'))
        m=0
        connection=connect_pool.get_connection()
        cursor=connection.cursor()
        cursor.execute("select scheduleId from injoy.trip where groupId=%s",[saveData["data"]["groupId"]])
        scheduleIdData=cursor.fetchall()
        connection.close()
        # 更新看板名稱
        connection=connect_pool.get_connection()
        cursor=connection.cursor()
        cursor.execute("update injoy.group set groupName=%s where groupId=%s",[saveData["data"]["groupName"],saveData["data"]["groupId"]])
        connection.commit()
        connection.close()
        # 整理 scheduleId List
        scheduleIdList=[]
        k=0
        while k<len(scheduleIdData):
            scheduleIdList.append(scheduleIdData[k][0])
            k+=1
        #判斷是否整個刪除行程
        if len(scheduleIdData)==len(saveData["data"]["scheduleId"]):
            while m<len(saveData["data"]["scheduleId"]):
                scheduleId=saveData["data"]["scheduleId"][m]
                connection=connect_pool.get_connection()
                cursor=connection.cursor()
                cursor.execute("delete from injoy.schedule where scheduleId=%s",[scheduleId])
                connection.commit()
                connection.close()
                n=0
                while n<23:
                    if str(n) in saveData["data"][scheduleId]:
                        connection=connect_pool.get_connection()
                        cursor=connection.cursor()
                        cursor.execute("insert into injoy.schedule (scheduleId,time,content) values (%s,%s,%s) ",[scheduleId,str(n),saveData["data"][scheduleId][str(n)]])
                        connection.commit()
                        connection.close()
                        n+=1
                    else:
                        n+=1
                m+=1
        else:
            # 判斷哪個行程被刪掉
            i=0
            Len=len(scheduleIdList)
            while i<len(scheduleIdList):
                if saveData["data"]["scheduleId"][i] in scheduleIdList :
                    scheduleIdList.remove(saveData["data"]["scheduleId"][i])
                    i+=1
                else:
                    i+=1
            l=0
            # 刪掉資料庫中的行程
            while l<len(scheduleIdList):
                connection=connect_pool.get_connection()
                cursor=connection.cursor()
                cursor.execute("delete from injoy.schedule where scheduleId=%s",[scheduleIdList[l]])
                cursor.execute("delete from injoy.trip where scheduleId=%s",[scheduleIdList[l]])
                connection.commit()
                connection.close()
                l+=1
        return{"message":"儲存成功"}
    else:
        return{"error": True,"message": "伺服器發生錯誤"}
	# except:
	# 	return {"error": True,"message": "伺服器發生錯誤"}


@app.route("/api/user",methods=["GET","POST","DELETE"])
def user():
    if request.method=="POST":
        postData=json.loads(request.data.decode('utf-8'))
        if "name" not in postData:
            signinEmail=postData["email"]
            # 連接mysql
            connection=connect_pool.get_connection()
            cursor=connection.cursor()
            cursor.execute("select * from injoy.member where email=%s",[signinEmail])
            signinData=cursor.fetchone()
            connection.close()
            # 判斷是否有使用者資料
            if signinData!=None:
                # 檢查密碼是否與帳號相符
                if signinData[3]==postData["password"]:
                    session["member"]=signinData[2]
                    return {"ok":True}
                else:
                    return {"error":True,"message":"信箱或密碼錯誤"}
            else:
                return {"error":True,"message":"信箱或密碼錯誤"}
        else:
            signupEmail=postData["email"]
            signupName=postData["name"]
            signupPassword=postData["password"]
            if signupEmail!=None or signupName!=None or signupPassword!=None:
                connection=connect_pool.get_connection()
                cursor=connection.cursor()
                cursor.execute("select * from injoy.member where email=%s",[signupEmail])
                signup_member=cursor.fetchone()
                connection.close()
                if signup_member==None:
                    connection=connect_pool.get_connection()
                    cursor=connection.cursor()
                    cursor.execute("insert into injoy.member (name,email,password) values (%s,%s,%s) ",[signupName,signupEmail,signupPassword])
                    connection.commit()
                    connection.close()
                    return {"ok":True}
                else:
                    return{"error":True,"message":"重複的email"}
            else:
                return{"error":True,"message":"資料有缺無法註冊"}
    elif request.method=="GET":
        if session.get("member")!="":
            memberEmail=session.get("member")
            # 連接mysql
            connection=connect_pool.get_connection()
            cursor=connection.cursor()
            cursor.execute("select injoy.member.id,injoy.member.email,injoy.member.name,injoy.groupemail.groupId,injoy.group.groupName from injoy.member left join injoy.groupemail on injoy.member.email=injoy.groupemail.email left join injoy.group on injoy.groupemail.groupId=injoy.group.groupId where injoy.member.email=%s",[memberEmail])
            memberData=cursor.fetchall()
            connection.close()
            groupData={}
            groupId=[]
            if memberData!=None:
            # 判斷是否有看板資料
                if memberData[0][3]!=None:
                    n=0
                    while n<len(memberData):
                        groupData[memberData[n][3]]=memberData[n][4]
                        groupId.append(memberData[n][3])
                        n+=1
                    return {"data":{"id":memberData[0][0],"name":memberData[0][1],"email":memberData[0][2],"groupId":groupId,"groupData":groupData}}  
                else:
                    return {"data":{"id":memberData[0][0],"name":memberData[0][1],"email":memberData[0][2],"groupId":None,"groupData":None}}
            else:
                session["member"]=""
                return{"data":None}	
        else:
            session["member"]=""
            return{"data":None}	
    elif request.method=="DELETE":
        session["member"]=""
        return{"ok":True}
    else:
        return {"error":True,"message":"error"}

@socketio.on('connect')
def handle_message(json):
    print('connect message: ' + str(json))


@socketio.on('my send')
def handle_my_custom_event(json):
    print('my send json: ' + str(json))
    member=session.get("member")
    json["member"]=member
    connection=connect_pool.get_connection()
    cursor=connection.cursor()
    cursor.execute("insert into injoy.chatroom (groupId,email,content) values (%s,%s,%s) ",[json["groupId"],member,json["content"]])
    connection.commit()
    connection.close()
    emit('my change', json,broadcast=True)







socketio.run(app, port=3000,debug=True)
# app.run(port=5000)