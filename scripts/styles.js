const avatarDiv = document.querySelector('.image-div');
function adjustAvatarDivHeight () {
  // avatarDiv.style.height = avatarDiv.offsetWidth;
}
window.onresize = adjustAvatarDivHeight;
window.onload = adjustAvatarDivHeight;