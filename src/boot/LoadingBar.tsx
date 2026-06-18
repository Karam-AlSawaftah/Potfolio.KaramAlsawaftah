export default function LoadingBar() {
  return (
    <div className="boot-xp">
      <img src="/icons/winxp-logo.png" className="boot-xp__flag" alt="" />
      <div className="boot-xp__wordmark">
        <span className="boot-xp__name">CHROME // COBALT</span>
        <span className="boot-xp__edition">Portfolio OS</span>
      </div>
      <div className="boot-xp__track">
        <div className="boot-xp__dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
