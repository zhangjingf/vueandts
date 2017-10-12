import Vue from "vue";
import appHello from "../../components/hello";
let v = new Vue({
    el: "#app",
    template: `
    <div>
        <div>Hello {{name}}!</div>
        Name: <input v-model="name" type="text">
        <app-hello :name="name" :initialEnthusiasm="5" />
    </div>`,
    data: {
        name: "World"
    },
    components: {
        appHello
    }
});