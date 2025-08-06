$("button.fp-btn_toggle").click(function () {
  $(".fp-menu").toggleClass("-open");
  $(this).toggleClass("-active");
});

$("[data-magnetic]").each(function (index) {
  console.log($(this).text());
});

$(".fp-btn_toggle").mouseleave(function (e) {
  TweenMax.to(this, 0.3, { scale: 1, x: 0, y: 0 });
});

$(".fp-btn_toggle").mouseenter(function (e) {
  TweenMax.to(this, 0.3, { scale: 1, x: 0, y: 0 });
});

$(".fp-btn_toggle").mousemove(function (e) {
  callParallax(e);
});

function callParallax(e) {
  parallaxIt(e, ".fp-btn_toggle", 9);
}

function parallaxIt(e, target, movement) {
  var $this = $(".fp-btn_toggle");
  var relX = e.pageX - $this.offset().left;
  var relY = e.pageY - $this.offset().top;

  TweenMax.to(target, 0.3, {
    x: ((relX - $this.width() / 2) / $this.width()) * movement,
    y: ((relY - $this.height() / 2) / $this.height()) * movement,
    ease: Power2.easeOut,
  });
}
