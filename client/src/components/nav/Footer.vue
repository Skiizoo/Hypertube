<template>
    <footer>
        <div>Copyright © 2019 <span class="title">Hypertube</span> - <span class="name">tbroggi / cchauvin / brobicho </span></div>
    </footer>
</template>

<script>
export default {
	name: "Footer",
}
</script>

<style scoped>
footer {
    text-align: center;
    border-top: 1px solid lightcoral;
    color: lightcoral;
    padding: 20px;
    font-size: small;
    position: relative;
    width: 100%;
    bottom: 0;
    background: #141414;
}
footer .name {
    font-style: italic;
}
footer .title {
    font-weight: 600;
}
</style>
