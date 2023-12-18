import { createStore } from "vuex";
import ImageDetailsModule from "./image-details-module";
import searchPhotosModule from "./search-photos-module";

export default createStore({
  modules: {
    searchPhotosModule: searchPhotosModule,
    ImageDetailsModule: ImageDetailsModule,
  },
});
