import {defineStore} from "pinia";

export const usePongStore = defineStore("game", {
    state: () => ({
        height: 0,
        width: 0
    }),
    actions: ({
        setHeight(value) {
            this.height = value;
        },
        setWidth(value) {
            this.width = value;
        }
    })
})
