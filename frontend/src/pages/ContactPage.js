const ContactPage = () => {
  return (
    <div className="min-h-screen" data-testid="contact-page">
      <section className="max-w-[800px] mx-auto px-8 py-24">
        <h1 className="font-display text-5xl md:text-6xl mb-12 text-center">Contact</h1>
        
        <div className="bg-secondary/30 p-12 rounded-sm text-center">
          <p className="font-body text-lg text-muted-foreground mb-6">
            You can write to us at
          </p>
          <a 
            href="mailto:closetory.cs@gmail.com"
            className="font-body text-2xl text-accent hover:text-accent/80 transition-colors"
            data-testid="contact-email"
          >
            closetory.cs@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
