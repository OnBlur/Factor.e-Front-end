import axios from "axios";

export const state = () => ({
  data: []
})

export const mutations = {
  setData(state, value) {
    state.data = value;
  },
  addData(state, value) {
    state.data.push(value);
  },
  editData(state, value) {
    const videoIndex = state.data.findIndex(
      video => video.id === value.id
    );
    state.data[videoIndex] = value;
  },
  deleteData(state, value) {
    state.data = state.data.filter(
      video => video.id !== value
    );
  }
}

export const actions = {
  getAllInit(vuexContext, context) {
    const requestOptions = {
      method: "GET",
      //   headers: authHeader()
    };
    return axios
      .get(process.env.baseUrl + "/get-all-videos", requestOptions)
      .then(res => {
        vuexContext.commit("setData", res.data.data);
      })
      .catch(e => {
        // console.log("nothing found")
        context.error(e);
      });
  },
  addVideo(vuexContext, value) {
    return axios
      .post(process.env.baseUrl + "/create-video", value)
      .then(result => {
        vuexContext.commit("addData", {
          ...value,
          id: result.data.data.id
        });
        console.log(result.data.data.videoId);
      })
      .catch(e => console.log(e));
  },
  editVideo(vuexContext, value) {
    const requestOptions = {
      // method: "PATCH",
      data: {
        project_id: value.project_id,
        name: value.name,
        link: value.link
      }
      //   headers: authHeader()
    };
    return axios
      .post(
        process.env.baseUrl + "/update-video/" + value.id, requestOptions
      )
      .then(res => {
        vuexContext.commit("editData", res.data.data);
      })
      .catch(e => console.log(e));
  },
  deleteVideo(vuexContext, value) {
    return axios
      .delete(process.env.baseUrl + "/delete-video/" + value)
      .then(() => {
        vuexContext.commit("deleteData", value);
      })
      .catch(e => alert(e.response.data.message));
  }
}

export const getters = {
  allData(state) {
    return state.data;
  },
  getVideo: state => id => {
    return state.data.find(item => item.id === id);
  }
}
