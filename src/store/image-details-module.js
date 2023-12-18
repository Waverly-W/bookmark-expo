import { unsplashApi } from "@/utils/api";

const ImageDetailsModule = {
  namespaced: true,
  state: {
    imageDetails: {},
  },
  getters: {},
  mutations: {
    SET_IMAGE_DETAILS(state, imageDetails) {
      state.imageDetails = imageDetails;
    },
  },
  actions: {
    async fetchPhoto({ commit }, id) {
      try {
        const response = await unsplashApi.get(`/photos/${id}`);
        console.log(response.data);
        commit("SET_IMAGE_DETAILS", response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    },
  },
};
export default ImageDetailsModule;
