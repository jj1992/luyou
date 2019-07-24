<template>
  <mu-container style="width:100vw;padding:0 65px;">

        <mu-form :model="form" ref="form" label-position="left">

           
              <!-- <img src="../assets/logo.png" /> -->
              <div style="width:242px; height:134px; margin:30px auto;">
                <img src="../assets/logo3.png" />
                <p style="width:242px; font-size:15px; color:#999; margin:0; text-align:center;">北京联通资源核查辅助工具</p>
              </div>
        

            <mu-form-item prop="username" label="账号" :rules="usernameRules" style="position:relative;">
                <mu-text-field v-model="form.username" prop="username"  @focus="showAccount" @blur="()=>{this.flag=false}"></mu-text-field>
                <ul v-if="flag" style="width:200px; list-style:none; background:#eee; position:absolute; padding:0; left:45px; top:34px; z-index:999;">
                  <li v-for="i in HistoryList" :key="i.id" @click="selectUser(i)" style="font-size:16px; height:30px; line-height:30px; color:#000;">{{i}}</li>
                </ul>                
            </mu-form-item>
 
            <mu-form-item prop="password" label="密码" :rules="passwordRules">
                <mu-text-field v-model="form.password" prop="password" type="password"></mu-text-field>
            </mu-form-item>
             
                <mu-button color="primary" full-width @click="login">登录</mu-button>
             
        </mu-form>


  </mu-container>

</template>


<script>
export default {
  data() {
    return {
      flag:false,
      form: {
        username: "",
        password: ""
      },
      usernameRules: [
        { validate: (val) => !!val, message: '必须填写用户名'},
        { validate: (val) => val.length >= 3 && val.length <= 30, message: '用户名长度大于3小于30'}
      ],
      passwordRules: [
        { validate: (val) => !!val, message: '必须填写密码'},
        { validate: (val) => val.length >= 8, message: '密码长度大于等于8'}
      ],
      HistoryList:[]
    };
  },
mounted() { 
  try{
    this.HistoryList = JSON.parse(localStorage.getItem("HistoryList")); 
          if(this.HistoryList == null || this.HistoryList == undefined){
        this.HistoryList =[];
      }
    //console.log(this.HistoryList)
  }catch(e){
    this.HistoryList=[];
  }
},
  methods: {
     selectUser(i){
       this.flag = false;
       this.form.username = i;
     },
     showAccount(){
       this.flag = true;
     },
     login(){

       this.$refs.form.validate().then((result) => {

         if(result){

            let params = new URLSearchParams();

            params.append("userName",this.form.username);
            params.append("passWord",this.$md5.base64(this.$md5.base64(this.form.username)+this.form.password));//使用MD5(base64)加密

            this.$axios.post("/user/login",params).then((resp)=>{

                if(resp.data.code === 200){

                  this.$store.state.authorityContent = resp.data.data.authorityContent;

                  window.localStorage.setItem('AreaIds',resp.data.data.areaIds.toString());
                  window.localStorage.setItem('Bureaus',resp.data.data.bureaus.toString());
                  window.localStorage.setItem('AuthorName',this.form.username);
                  this.$router.replace("/gisMap");

                }else{

                  this.$toast.error(resp.data.data);

                }
            }).catch(()=>{

              this.$toast.error("网络错误");

            });
         }
      });
      this.searchVal();
     },
    searchVal(){
      var val = this.form.username
      val = val.trim() // 清除空格
      if(val!=""){
        if (this.HistoryList.length > 0) { // 有数据的话 判断
          if (this.HistoryList.indexOf(val) !== -1) { // 有相同的，先删除 再添加 
            this.HistoryList.splice(this.HistoryList.indexOf(val), 1)
            this.HistoryList.unshift(val)
          } else { // 没有相同的 添加
            this.HistoryList.unshift(val)
          }
        } else { // 没有数据 添加
          this.HistoryList.unshift(val)
        }
        if (this.HistoryList.length > 6) { // 保留六个值
          this.HistoryList.pop()
        }
        localStorage.setItem('HistoryList', JSON.stringify(this.HistoryList))        
      }

    }
  }
};
</script>

