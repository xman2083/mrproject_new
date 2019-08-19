<template>
  <span>
    <div class="layer">
      <h3 style="color:#3fc1c9">{{this.$store.state.user.user_name}}님 안녕하세요!</h3>
      <p style="color:#364f6b">
        <br />SKtelink 회의실 예약 & 식단표 조회 페이지 입니다.
        <br />문의사항은 Platform개발팀으로 연락 부탁드립니다.
        <br />행복한 하루 되세요 :)
        <br />
      </p>
    </div>
  </span>
</template>


<script>
export default {
  methods: {},

  async created() {
    await this.$store.dispatch("GETUSER", {
      tel_num: this.$store.state.user.tel_num,
      token: this.$store.state.token
    });
  }
};
</script>

<style>
.test {
  padding: 20px;
  margin: 20px 0;
  box-sizing: border-box;
  background: #eee;
}

.layer {
  position: absolute;
  top: 37%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>