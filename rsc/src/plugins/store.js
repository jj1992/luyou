import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
    state:{


        BuildingDevices:{
            
            buildName:"",
            bureau:"",
            area:""
        },
        areaIds:[],
        authorityContent:[],
        posPortStatus:{
            0:"空闲",
            1:"预占",
            2:"占用",
            3:"预留",
            4:"故障",
            5:"空端口"      
        },
    }
})
