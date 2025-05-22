import '../styles/ContactUsFooter.scss'

const ContactUsFooter = () => {
  return (
    <div className="contact_notes">
      <h2>ContactUs | HeroTasks</h2>
      <p>
      Have a question, found a bug, or just want to say hi? We're here to help!
      </p>

      <p>
        Whether you're a superhero mom, a power-packed kid, or just exploring HeroTasks, we’d love to hear from you. Reach out for:
      </p>

      <ul className="contact_list">
        <li>
          🔧 <strong>Technical Support</strong> – Trouble logging in or using a feature? Let us know!
        </li>
        <li>
          💡 <strong>Suggestions</strong> – Have an idea to make HeroTasks even better?
        </li>
        <li>
          🛠️ <strong>Bug Reports</strong> – Spot something broken? Help us squash it.
        </li>
        <li>
          🤝 <strong>Partnership Inquiries</strong> – Interested in collaborating with us?
        </li>
      </ul>

      <hr />

      <section className="contact_info">
        <h3>📬 Get in Touch</h3>
        <p><strong>Email:</strong> <a href="mailto:support@herotasks.app">support@herotasks.app</a></p>
        <p><strong>Website:</strong> <a href="https://www.herotasks.app" target="_blank" rel="noopener noreferrer">www.herotasks.app</a></p>
        <p><strong>Follow us:</strong></p>
        <ul className="social_links">
          <li>🐦 Twitter: <a href="https://twitter.com/HeroTasksApp" target="_blank" rel="noopener noreferrer">@HeroTasksApp</a></li>
          <li>📘 Facebook: <a href="https://facebook.com/HeroTasks" target="_blank" rel="noopener noreferrer">HeroTasks</a></li>
        </ul>
      </section>

      <hr />

      <section className="contact_response">
        <h3>🕓 Response Time</h3>
        <p>We do our best to respond to all messages within <strong>24–48 hours</strong> (excluding weekends and holidays).</p>
      </section>

      <section className="contact_thanks">
        <h3>❤️ Thank You!</h3>
        <p>
          HeroTasks is built with love for families. Your feedback helps us grow stronger, one task at a time.
        </p>
      </section>

    </div>
  );
}

export default ContactUsFooter;