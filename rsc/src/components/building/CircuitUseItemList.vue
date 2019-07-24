<template>
    <mu-paper class="CircuitUseItemList">
        <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load">
            <mu-expansion-panel :expand="panel === i" @change="toggleShow(i)" v-for="i in data" :key='i.id'>
                <div slot="header">
                    <mu-flex align-items="center">
                        <mu-flex justify-content="center">
                            <mu-icon value="featured_play_list" color="orange"></mu-icon>
                        </mu-flex>
                        <mu-flex justify-content="center" fill class="flex">
                            <h3>神路街局非话机局 (2)</h3>
                        </mu-flex>
                    </mu-flex>
                    <span class="info">五区 | 861区</span>
                </div>
                <div slot="default">
                    <mu-list toggle-nested>
                        <template v-for="i in data">
                            <mu-list-item nested :open="open === i">
                                <mu-list-item-action style="min-width:30px">
                                    <mu-icon value="featured_play_list" color="orange"></mu-icon>
                                </mu-list-item-action>
                                <mu-list-item-content @click="toggle(i)">
                                    <mu-list-item-title>神路街局非话机局 (10)</mu-list-item-title>
                                    <mu-list-item-sub-title>
                                        <span class="info">
                                            五区-神路街|北京港澳中心瑞士酒店
                                        </span>
                                    </mu-list-item-sub-title>
                                </mu-list-item-content>
                                <mu-list-item-action>
                                    <mu-icon :value="open === i ?'keyboard_arrow_up' : 'keyboard_arrow_down'"></mu-icon>
                                </mu-list-item-action>
                                <mu-list-item-action>
                                    <mu-button flat @click="toDetail">
                                        详情
                                        <mu-icon :size="24" right value="keyboard_arrow_right"></mu-icon>
                                    </mu-button>
                                </mu-list-item-action>
                                <mu-list-item :ripple="false" slot="nested">
                                    <mu-row>
                                        <mu-col>
                                            <span>网络系统</span> | 华为专线
                                        </mu-col>
                                    </mu-row>
                                </mu-list-item>

                                <mu-list-item :ripple="false" slot="nested">
                                    <mu-row>
                                        <mu-col>
                                            <span>厂家</span> | 华为
                                        </mu-col>
                                    </mu-row>
                                </mu-list-item>

                                <mu-list-item :ripple="false" slot="nested">
                                    <mu-row class="info-row">
                                        <mu-col>
                                            <span>设备型号</span> | NE40E
                                        </mu-col>
                                    </mu-row>
                                </mu-list-item>
                                <mu-list-item :ripple="false" slot="nested">
                                    <mu-row class="info-row">
                                        <mu-col>
                                            <span>设备LOOPBACK地址</span> | 192.168.1.1
                                        </mu-col>
                                    </mu-row>
                                </mu-list-item>
                            </mu-list-item>
                        </template>
                    </mu-list>
                </div>
            </mu-expansion-panel>
        </mu-load-more>
    </mu-paper>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      refreshing: false,
      panel: "",
      open: "",
      selects: false,
      data: [1, 2, 3, 4]
    };
  },
  methods: {
    toggle(i) {
      this.open = this.open == i ? "" : i;
      this.selects = this.open == i;
    },
    toggleShow(i) {
      this.panel = this.panel == i ? "" : i;
    },
    load() {
      console.info("load");
    },
    refresh() {
      console.info("refresh");
    },
    toDetail() {
      console.info(123);
    }
  }
};
</script>
<style scoped>
.info {
  color: #ccc;
  font-size: 16px;
}
.flex {
  margin-left: 3px;
}
.panel1 {
  background-color: #f5f5f5;
}
.panel2 {
  background-color: #eeeeee;
}
.info-row {
  padding: 5px 0px;
}
.CircuitUseItemList {
  height: 100%;
}
</style>