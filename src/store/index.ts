import moment from "moment";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selectedYear: moment().year()
  },
    mutations: {
    updateYear (state, selectedYear: number) {
      state.selectedYear = selectedYear
    }
  },
    actions: {
    updateYear (context, selectedYear: number) {
      context.commit('updateYear', selectedYear);
    }
}})

export default store;
