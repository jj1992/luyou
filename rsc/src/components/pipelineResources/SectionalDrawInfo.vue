<template>
    <div  class="sectionalDrawInfo">
        <div style="overflow:scroll; -webkit-overflow-scrolling: touch;">
        <iframe
            id="iframePanel"
            name="sectionalifram"
            src="./dan_jiemian.html"
            style="height:100vh;top:100px;width:100vh"
        />
        </div>
        <!-- <img src="../../assets/jiemian.png" style="width:100%; height:100%;"> -->
    </div>
</template>

<script>
export default { 
    props:["id"],
    data(){
        return{
            
        }
    },
    created(){
        // localStorage.setItem("id",this.id)
        // localStorage.getItem("");
    },
    methods:{
        formData(){
            let params=new URLSearchParams();
            params.append("id",this.id);
            this.$axios.post("jieMian/list",params).then((res) => {
                if(res.data.code==200){                             
                    window.sectionalifram.danParams.danData(res.data.data)
                }else{
                    
                }
            }).catch(() => {
            
            });
        },
    },
    mounted(){
        this.formData()
    }
}
</script>

<style scoped>

</style>

