/* ===== Botões do WhatsApp: cada botão pode ter a sua própria mensagem (data-msg) ===== */
document.querySelectorAll("a.zap").forEach(a => {
  const msg = a.dataset.msg || MSG_INICIAL;
  a.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
});
