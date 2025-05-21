import '../styles/ContactUsFooter.scss'

const ContactUsFooter = () => {
  return (
      <div className="contact_notes">
        <h2>ContactUs | HeroTasks</h2>
        <p>Have a question, found a bug, or just want to say hi? We're here to help!
        </p>

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

      </div>
    

  );
}

export default ContactUsFooter;