<template>
<!-- <Attendance /> -->
 <Layout />
 <router-view></router-view>
</template>
<script>
import Layout from './components/Pages/Layout.vue';

export default{
    components:{
        Layout,
    }
}
</script>