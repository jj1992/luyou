import Vue from 'vue'
import Router from 'vue-router'
import BuildingDeviceListIndex from "@/components/building/BuildingDevices";

import BuildingItem from "@/components/building/BuildingItemList";
 


import ComputerRoomDetail from '@/components/building/ComputerRoomDetail';
import OutDoorDetail from '@/components/building/OutDoorDetail';



import WallPointDetail from '@/components/building/WallPointDetail';

import Login from '@/components/Login.vue';

import OpticalfiberIndex from '@/components/opticalfiber/index.vue';
import OpticalfiberDetails from '@/components/opticalfiber/details.vue';
import BuildingDetail from '@/components/building/BuildingDetail.vue';

import ServiceBrace from '@/components/building/ServiceBrace.vue';
import Passive from '@/components/passiveManage/PassiveDevice.vue';
import PassiveDevice from '@/components/passiveManage/PassiveDevicePos.vue';
import PosDetail from '@/components/passiveManage/PosDetail.vue';
import GisMap from '@/components/gis/GisMap.vue';
import onlyGis from '@/components/gis/OnlyGis.vue';
import OnlyPointGis from '@/components/gis/OnlyPointGis.vue';
import OnlyWallAndRoomGis from '@/components/gis/OnlyWallAndRoomGis.vue';
import OdfTerminalDetail from '@/components/passiveManage/OdfTerminalDetail.vue';


import BuildService from '@/components/building/BuildService.vue';
// import DedicatedLine from '@/components/building/DedicatedLine';
// import RelayNode from '@/components/building/RelayNode';
import LineFullRoute from '@/components/building/LineFullRoute';
import DedicatedLineInfo from '@/components/building/DedicatedLineInfo';
import OrderSheetInfo from '@/components/building/OrderSheetInfo';
import RouteInfo from '@/components/building/RouteInfo';
import RelayFullRoute from '@/components/building/RelayFullRoute';
import CircuitryInfo from '@/components/building/CircuitryInfo';
import OrderSheetInfo2 from '@/components/building/OrderSheetInfo2';
import RouteInfo2 from '@/components/building/RouteInfo2';

import CircuitUse from '@/components/building/CircuitUse.vue';
 
import CircuitUseItemList from '@/components/building/CircuitUseItemList.vue';

import OdfPostDetail from '@/components/passiveManage/OdfPostDetail.vue';
import CoreModification from '@/components/passiveManage/CoreModification.vue';

import ActiveDeviceInfo from '@/components/activeDevice/ActiveDeviceInfo';
import ActiveDeviceDetail from '@/components/activeDevice/ActiveDeviceDetail';
import PortInfo from '@/components/activeDevice/PortInfo';


import OdfPostDetailTable from '@/components/passiveManage/OdfPostDetailTable.vue';
import OdfPostDetailList from '@/components/passiveManage/OdfPostDetailList.vue';
import BuildingResult from "@/components/building/BuildingList";
import CRoomSearch from "@/components/mapSearch/CRoomSearch";
import WPointSearch from "@/components/mapSearch/WPointSearch";
import OutPSearch from "@/components/mapSearch/OutPSearch";
import ActiveDeviceSearch from "@/components/mapSearch/ActiveDeviceSearch";


import BuildingItemResult from "@/components/building/BuildingItemList";

import ComputerRoomResource from "@/components/building/ComputerRoomResource"

import BuildingLocalResult from "@/components/gis/BuildingLocalResult"
import OutPLocalResult from "@/components/gis/OutPLocalResult"
import ManholeResult from "@/components/gis/ManholeResult"
//电路查询
import CircuitNumberResult from "@/components/gis/CircuitNumberResult"

// 管线资源信息
//地井
import ManholeList from "@/components/pipelineResources/ManholeList";
import ManholeDetail from "@/components/pipelineResources/ManholeDetail";
//电杆
import PoleList from "@/components/pipelineResources/PoleList";
import PoleDetail from "@/components/pipelineResources/PoleDetail";
import PoleResult from "@/components/gis/PoleResult";
//管段
import TubulationDetail from "@/components/pipelineResources/TubulationDetail";
import TubulationList from "@/components/pipelineResources/TubulationList";
import TubulationResult from "@/components/pipelineResources/TubulationResult";
import TubulationSearch from "@/components/gis/TubulationSearch";
//杆路段
import BarsectionList from "@/components/pipelineResources/BarsectionList";
import BarsectionDetail from "@/components/pipelineResources/BarsectionDetail";
import BarsectionResult from "@/components/pipelineResources/BarsectionResult";
import BarsectionSearch from "@/components/gis/BarsectionSearch";
//局所
import OfficeList from "@/components/pipelineResources/OfficeList";
import OfficeDetail from "@/components/pipelineResources/OfficeDetail";
import OfficeSearch from "@/components/gis/OfficeSearch";
//截面信息
import SecInfo from "@/components/pipelineResources/SecInfo";
// import SectionalDrawInfo from '@/components/pipelineResources/SectionalDrawInfo';
// import PipeHoleInfo from '@/components/pipelineResources/PipeHoleInfo';
// import CableInfo from '@/components/pipelineResources/CableInfo';
//查看缆
import CableResult from "@/components/pipelineResources/CableResult";
//光缆
import OpticalCableSearch from "@/components/pipelineResources/OpticalCableSearch";
import OpticalCableDetail from "@/components/pipelineResources/OpticalCableDetail";
import OpticalCableRouting from "@/components/pipelineResources/OpticalCableRouting";
//光缆段
import OpticalCableSegmentList from "@/components/pipelineResources/OpticalCableSegmentList";
import OpticalCableSegmentDetail from "@/components/pipelineResources/OpticalCableSegmentDetail";
import OpticalCableSegmentRouting from "@/components/pipelineResources/OpticalCableSegmentRouting";
import OpticalFiberCableBureau from "@/components/pipelineResources/OpticalFiberCableBureau";

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/manholeDetail',
      name: 'manholeDetail',
      component: ManholeDetail,
      props: (route) => ({ id: route.query.id }) ,
    },
    {
      path: '/poleDetail',
      name: 'poleDetail',
      component: PoleDetail,
      props: (route) => ({ id: route.query.id }) ,
    },
    {
      path: '/tubulationResult',
      name: 'tubulationResult',
      component: TubulationResult,
      props: (route) => ({ id: route.query.id }) ,
    },
    {
      path: '/tubulationDetail',
      name: 'tubulationDetail',
      component: TubulationDetail,
      props: (route) => ({ id: route.query.id }) ,
    },
    {
      path: '/barsectionResult',
      name: 'barsectionResult',
      component: BarsectionResult,
    },
    {
      path: '/barsectionDetail',
      name: 'barsectionDetail',
      component: BarsectionDetail,
      props: (route) => ({ id: route.query.id }) ,
    },
    //光缆段
    {
      path: '/opticalCableDetail',
      name: 'opticalCableDetail',
      component: OpticalCableDetail,
      props: (route) => ({ id: route.query.id }) ,
    },
    {
      path: '/opticalCableRouting',
      name: 'opticalCableRouting',
      component: OpticalCableRouting,
      props: (route) => ({ id: route.query.id }) ,
    },
    {
      path: '/officeDetail',
      name: 'officeDetail',
      component: OfficeDetail,
      props: (route) => ({ id: route.query.id }) ,
    },
    {
      path: '/secInfo',
      name: 'secInfo',
      component: SecInfo,
      props: (route) => ({ id: route.query.id ,duanleixingId:route.query.duanleixingId}),
      // redirect: '/sectionalDrawInfo',
      // children:[
      //   {path:'/sectionalDrawInfo',name:'sectionalDrawInfo',component:SectionalDrawInfo,props: (route) => ({id: route.query.id}),meta: { keepAlive: true }},
      //   {path:'/pipeHoleInfo',name:'pipeHoleInfo',component:PipeHoleInfo,props: (route) => ({  }),meta: { keepAlive: true }},
      //   {path:'/cableInfo',name:'cableInfo',component:CableInfo,props: (route) => ({ }),meta: { keepAlive: true }}
      // ], 
    },
    {
      path: '/cableResult',
      name: 'cableResult',
      component: CableResult,
      props: (route) => ({ type: route.query.type,id: route.query.id })
    },
    //光缆段
    {
      path: '/opticalCableSegmentList',
      name: 'opticalCableSegmentList',
      component: OpticalCableSegmentList,
      props: (route) => ({ guanglanId: route.query.guanglanId })
    },
    {
      path: '/opticalCableSegmentDetail',
      name: 'opticalCableSegmentDetail',
      component: OpticalCableSegmentDetail,
      props: (route) => ({ id: route.query.id })
    },
    {
      path: '/opticalCableSegmentRouting',
      name: 'opticalCableSegmentRouting',
      component: OpticalCableSegmentRouting,
      props: (route) => ({ id: route.query.id })
    },
    {
      path: '/opticalFiberCableBureau',
      name: 'opticalFiberCableBureau',
      component: OpticalFiberCableBureau,
      props: (route) => ({ id: route.query.id }) ,
    },
    {
      path: "/buildingDeviceListIndex",
      component:BuildingDeviceListIndex,
      props: (route) => ({ buildId: route.query.buildId }) ,
      children:[
        {path:'/ItemWallPoint',name:'ItemWallPoint',component:BuildingItem,props: (route) => ({ type: route.query.type,buildId:  route.query.buildId  })},
        {path:'/ItemAll',name:'ItemAll',component:BuildingItem,props: (route) => ({ type: route.query.type,buildId:  route.query.buildId   })},
        {path:'/ItemCRoom',name:'ItemCRoom',component:BuildingItem,props: (route) => ({ type: route.query.type,buildId:  route.query.buildId })}
      ], 
      
    },{
      path: '/OpticalfiberIndex',
      name: '/OpticalfiberIndex',
      component: OpticalfiberIndex,
      
    },{
      path:'/OpticalfiberDetails',name:'/OpticalfiberDetails',component:OpticalfiberDetails, props:(route) => ({id:route.query.id,motorRootStartId:route.query.motorRootStartId,motorRootEndId:route.query.motorRootEndId})
    },
    {
      path: '/buildingDetail',
      name: '/buildingDetail',
      component: BuildingDetail,
      props:(route) => ({id:route.query.id,buildingType:route.query.buildingType})
    },
       {
      path: '/computerRoomDetails/',
      name: '/computerRoomDetails',
      component: ComputerRoomDetail,
      props: (route) => ({ id: route.query.id})
    },
    {
      path: '/outDoorDetail/',
      name: '/outDoorDetail',
      component: OutDoorDetail,
      props: (route) => ({id: route.query.id})
    },    
    {
      path: '/posDetail/',
      name: '/posDetail',
      component: PosDetail,
      props: (route) => ({ id: route.query.id , qrStr: route.query.qrStr})
    },   
    {
      path: '/wallPointDetails/',
      name: '/wallPointDetails',
      component: WallPointDetail,
      props: (route) => ({ id: route.query.id})
    },
    {
      path: '/buildService',
      name: '/buildService',
      component: BuildService,
      props: (route) => ({ buildId: route.query.buildId }),
      // children:[
      //   {path:"/buildService/dedicatedLine",name:"dedicatedLine",component:DedicatedLine,props: (route) => ({ type: route.query.type,buildId:route.query.buildId  })},
      //   {path:"/buildService/relayNode",name:"relayNode",component:RelayNode,props: (route) => ({ type: route.query.type,buildId:route.query.buildId  }),meta: { keepAlive: true }}
      // ]
    },
    {
      path: '/lineFullRoute',
      name: '/lineFullRoute',
      component:LineFullRoute,
      props: (route) => ({ type: route.query.type,code:route.query.code,leasedLineStatus:route.query.leasedLineStatus,}),
      children:[ 
        {path:"/lineFullRoute/orderSheetInfo",name:"orderSheetInfo",component:OrderSheetInfo},
        {path:"/lineFullRoute/dedicatedLineInfo",name:"dedicatedLineInfo",component:DedicatedLineInfo},
        {path:"/lineFullRoute/routeInfo",name:"routeInfo",component:RouteInfo},
      ]
    },
    {
      path: '/relayFullRoute',
      name: '/relayFullRoute',
      component:RelayFullRoute,
      props: (route) => ({ type:route.query.type,specialLineCode:route.query.specialLineCode}),
      children:[
        {path:"/relayFullRoute/orderSheetInfo2",name:"orderSheetInfo2",component:OrderSheetInfo2},
        {path:"/relayFullRoute/circuitryInfo",name:"circuitryInfo",component:CircuitryInfo},
        {path:"/relayFullRoute/routeInfo2",name:"routeInfo2",component:RouteInfo2},
      ]
    },
    {
      path: '/serviceBrace',
      name: '/serviceBrace',
      component: ServiceBrace,
      props: (route) => ({ buildId: route.query.buildId,buildName: route.query.buildName,jfid: route.query.jfid,id: route.query.id,type: route.query.type,bureauId:route.query.bureauId})
    },
    {
      path: '/circuitUse',
      name: '/circuitUse',
      component: CircuitUse,
      children:[
        {path:'/circuitUseItemList',name:'circuitUseItemList',component:CircuitUseItemList}
      ],
    },
    {
      path: '/passive',
      name: '/passive',
      component: Passive
    },
    {
      path: '/odfTerminalDetail',
      name: '/odfTerminalDetail',
      component: OdfTerminalDetail,
      props: (route) => ({ id: route.query.id})
    },
    {
      path: '/gisMap',
      name: '/gisMap',
      component: GisMap,
      children: [
        {path:'/buildingResult',name:'/buildingResult',component: BuildingResult,props: (route) => ({ type: route.query.type, search:  route.query.search })},
        {path:'/CRoomSearch',name:'/CRoomSearch',component: CRoomSearch,props: (route) => ({ type: route.query.type, search:  route.query.search })},
        {path:'/WPointSearch',name:'/WPointSearch',component: WPointSearch,props: (route) => ({ type: route.query.type, search:  route.query.search })},
        {path:'/OutPSearch',name:'/OutPSearch',component: OutPSearch,props: (route) => ({ type: route.query.type, search:  route.query.search })},
        {path:'/ActiveDeviceSearch',name:'/ActiveDeviceSearch',component: ActiveDeviceSearch,props: (route) => ({ type1: route.query.type1, search:  route.query.search })},
              
        {path:'/buildingLocalResult',name:'/buildingLocalResult',component: BuildingLocalResult,props: (route) => ({ type: route.query.type, search:  route.query.search })},
        {path:'/outPLocalResult',name:'/outPLocalResult',component: OutPLocalResult,props: (route) => ({ type: route.query.type, search:  route.query.search })},
        {path:'/ItemWallPointResult',name:'ItemWallPointResult',component:BuildingItemResult,props: (route) => ({ type: route.query.type,buildId:  route.query.buildId })},
        {path:'/ItemCRoomResult',name:'ItemCRoomResult',component:BuildingItemResult,props: (route) => ({ type: route.query.type,buildId:  route.query.buildId})},
        {path:'/passiveDevice',name:'PassiveDevice',component:PassiveDevice,props: (route) => ({ type: route.query.type,name: route.query.name})},
        //电路编号查询列表
        { path: '/circuitNumberResult',name: 'circuitNumberResult',component: CircuitNumberResult,props: (route) => ({circuitNumber: route.query.search})},
        //局所
        { path: '/officeList',name: 'officeList',component: OfficeList,props: (route) => ({name: route.query.search})},
        //地井
        { path: '/manholeList',name: '/manholeList',component: ManholeList,props: (route) => ({ type: route.query.type, search:  route.query.search })},        
        {path:'/manholeResult',name:'/manholeResult',component: ManholeResult,props: (route) => ({search:  route.query.search})},
        //电杆
        { path: '/poleList',name: '/poleList',component:PoleList,props: (route) => ({ type: route.query.type, search:  route.query.search })},        
        {path:'/poleResult',name:'/poleResult',component: PoleResult,props: (route) => ({search:  route.query.search})},     

        //管段
        { path: '/tubulationList',name: 'tubulationList',component:TubulationList,props: (route) => ({ type: route.query.type, search:  route.query.search })},
        {path:'/tubulationSearch',name:'tubulationSearch',component: TubulationSearch,props: (route) => ({search:  route.query.search})}, 
        //杆路段
        { path: '/barsectionList',name: 'barsectionList',component:BarsectionList,props: (route) => ({ type: route.query.type, search:  route.query.search })},
        {path:'/barsectionSearch',name:'barsectionSearch',component: BarsectionSearch,props: (route) => ({search:  route.query.search})}, 
        //光缆
        { path: '/opticalCableSearch',name: 'opticalCableSearch',component:OpticalCableSearch,props: (route) => ({name: route.query.search})},

      ],
    },
    {
      path: '/odfPostDetail',
      name: 'odfPostDetail',
      component: OdfPostDetail,
      props: (route) => ({ id: route.query.id }),
      
      children:[
        {path:'/OdfPostDetailTable',name:'OdfPostDetailTable',component:OdfPostDetailTable,props: (route) => ({ terminalInfo: route.query.terminalInfo})},
        {path:'/OdfPostDetailList',name:'OdfPostDetailList',component:OdfPostDetailList,props: (route) => ({ terminalInfo: route.query.terminalInfo})},
      ],
    },
    {
      path: '/coreModification',
      name: 'coreModification',
      component: CoreModification,
      props: (route) => ({ id: route.query.id})
    },
    {
      path: '/activeDeviceInfo',
      name: 'activeDeviceInfo',
      component: ActiveDeviceInfo
    },
    {
      path: '/activeDeviceDetail',
      name: 'activeDeviceDetail',
      component: ActiveDeviceDetail,
      props: (route) => ({ id: route.query.id})
    },
    {
      path: '/portInfo',
      name: 'portInfo',
      component: PortInfo,
      props: (route) => ({ id: route.query.id})
    },

    {
      path: '/computerRoomResource',
      name: 'computerRoomResource',
      component: ComputerRoomResource,
      props: (route) => ({ id: route.query.id}),
      redirect:'copticalfiberIndex',
      children:[
        {path:'/copticalfiberIndex',name:'copticalfiberIndex',component:OpticalfiberIndex,props: (route) => ({ id: route.query.id}),meta:{keepAlive:true}},
        {path:'/cpassive',name:'cpassive',component:Passive,props: (route) => ({ id: route.query.id}),meta:{keepAlive:true}},
        {path:'/cactiveDeviceInfo',name:'cactiveDeviceInfo',component:ActiveDeviceInfo,props: (route) => ({ id: route.query.id}),meta:{keepAlive:true}}
      ] 
    },
    {//给pos里定位用的 一个简单的地图页面，没有搜索和其他功能主要是图选，返回绑定pos
      path: '/onlyGis',
      name: '/onlyGis',
      component: onlyGis,
      props: (route) => ({ posId: route.query.posId}),
    },
    {//给放置点修改坐标用的 一个简单的地图页面，没有搜索和其他功能主要是选择坐标
      path: '/onlyPointGis',
      name: '/onlyPointGis',
      component: OnlyPointGis,
      props: (route) => ({ id: route.query.id}),
    },
    {//给机房和壁挂点选择坐标用的 一个简单的地图页面，没有搜索和其他功能主要是选择坐标，修改类型
      path: '/onlyWallAndRoomGis',
      name: '/onlyWallAndRoomGis',
      component: OnlyWallAndRoomGis,
      props: (route) => ({id:route.query.id,type:route.query.type,deviceClass:route.query.deviceClass}),
    }
  ]
})