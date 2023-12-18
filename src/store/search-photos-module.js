import { unsplashApi } from "@/utils/api";
const searchPhotosModule = {
  namespaced: true,
  state: {
    photos: [],
    totalPhotos: 0,
    totalPages: 0,
  },
  getters: {},
  mutations: {
    SET_PHOTOS(state, photos) {
      state.photos = photos;
    },
    SET_TOTAL_PHOTOS(state, totalPhotos) {
      state.totalPhotos = totalPhotos;
    },
    SET_TOTAL_PAGES(state, totalPages) {
      state.totalPages = totalPages;
    },
  },
  actions: {
    async fetchPhotos({ commit }, payload) {
      try {
        const response = await unsplashApi.get("/search/photos", {
          params: {
            query: payload.query,
            per_page: 30,
          },
        });
        commit("SET_PHOTOS", response.data.results);
        commit("SET_TOTAL_PHOTOS", response.data.total);
        commit("SET_TOTAL_PAGES", response.data.total_pages);

        console.log(response);
      } catch (error) {
        console.log(error.response.data);
      }
    },
  },
};

export default searchPhotosModule;
