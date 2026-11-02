// TODO: connect here
import './SellerInfoBar.css'

export default function SellerInfoBar() {
  return (
    <section className="seller-bar" aria-label="Seller information">
      <div className="seller-bar__container">
        <div className="seller-bar__left">
          <img
            src="https://picsum.photos/seed/sellerlogo/200/200"
            alt="Seller logo"
            className="seller-bar__photo"
          />
          <div className="seller-bar__info">
            <div className="seller-bar__name-row">
              <span className="seller-bar__name">Rang Studio</span>
              <span className="seller-bar__tag">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6.4 4.6 9 10 2.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Family owned
              </span>
            </div>
            <div className="seller-bar__location">Karachi, Pakistan</div>
            <div className="seller-bar__meta">
              <div className="seller-bar__meta-item">
                <svg className="seller-bar__star" width="13" height="13" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M7 1l1.8 4.2H13l-3.4 2.8 1.3 4.2L7 9.4 3.1 12.2l1.3-4.2L1 5.2h4.2L7 1z" />
                </svg>
                <span>5.0 (12 reviews)</span>
              </div>
              <span className="seller-bar__divider" aria-hidden="true"></span>
              <span>32 sales</span>
              <span className="seller-bar__divider" aria-hidden="true"></span>
              <span>6 months on Handy</span>
            </div>
          </div>
        </div>
        <div className="seller-bar__right">
          {/* TODO: connect here */}
          <button className="seller-bar__btn seller-bar__btn--primary" type="button">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2 4h12v7H6l-4 3V4z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Contact</span>
          </button>
          {/* TODO: connect here */}
          <button className="seller-bar__btn" type="button">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M8 13.1l-0.8-0.7C4.4 9.6 2.6 8 2.6 6.0 2.6 4.4 3.9 3.2 5.5 3.2c0.9 0 1.8 0.4 2.4 1.1 0.6-0.7 1.5-1.1 2.4-1.1 1.6 0 2.9 1.2 2.9 2.8 0 2.0-1.8 3.6-4.6 6.4L8 13.1z" />
            </svg>
            <span>Follow</span>
          </button>
        </div>
      </div>
    </section>
  )
}
