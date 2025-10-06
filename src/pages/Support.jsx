import { Mail, Download, FileText, HelpCircle } from 'lucide-react';
import './Support.scss';

function Support() {
  return (
    <div className="support-page">
      <div className="container">
        <div className="support-header">
          <h1>Support</h1>
        </div>

        <div className="support-grid">

          <div className="support-section">
            <div className="support-section__header">
              <h2>Using Your Downloaded Files</h2>
            </div>
            <div className="support-content">
              <div className="support-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Extract the ZIP File</h3>
                  <p>After downloading, extract the ZIP file to a folder on your computer. You'll find an <code>index.html</code> file and an <code>images/</code> folder.</p>
                </div>
              </div>

              <div className="support-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>View Locally</h3>
                  <p>Double-click the <code>index.html</code> file to open it in your web browser. Your website is now visible and ready to use!</p>
                </div>
              </div>

              <div className="support-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Add Your Images</h3>
                  <p>Place your images in the <code>images/</code> folder. Check the <code>README.txt</code> file inside for specific image names and dimensions.</p>
                </div>
              </div>

              <div className="support-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Deploy Online</h3>
                  <p>Upload all files to your web hosting service, or use free platforms like:</p>
                  <ul>
                    <li><strong>Netlify:</strong> Drag and drop to <a href="https://netlify.com/drop" target="_blank" rel="noopener noreferrer">netlify.com/drop</a></li>
                    <li><strong>Vercel:</strong> Deploy with the Vercel CLI or GitHub integration</li>
                    <li><strong>GitHub Pages:</strong> Push to a repository and enable Pages</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="support-section">
            <div className="support-section__header">
              <FileText size={24} />
              <h2>Editing Your Website</h2>
            </div>
            <div className="support-content">
              <div className="support-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Open in a Text Editor</h3>
                  <p>Use any code editor like VS Code, Sublime Text, or even Notepad to open <code>index.html</code>.</p>
                </div>
              </div>

              <div className="support-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Find Content to Edit</h3>
                  <p>Look for sections marked with <code>data-editable</code> attributes. These are the parts you customized and can easily change.</p>
                </div>
              </div>

              <div className="support-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Customize Colors</h3>
                  <p>Find the <code>:root</code> section in the <code>&lt;style&gt;</code> tag and modify the <code>--accent</code> color value to change your theme.</p>
                </div>
              </div>

              <div className="support-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Save and Refresh</h3>
                  <p>Save your changes and refresh your browser to see the updates instantly.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="support-section">
            <div className="support-section__header">
              <HelpCircle size={24} />
              <h2>Common Questions</h2>
            </div>
            <div className="support-content">
              <div className="faq-item">
                <h3>Can I use these templates commercially?</h3>
                <p>Yes! All templates are yours to use for personal or commercial projects.</p>
              </div>

              <div className="faq-item">
                <h3>Do I need coding knowledge?</h3>
                <p>No coding required! However, basic HTML knowledge helps if you want to make custom changes.</p>
              </div>

              <div className="faq-item">
                <h3>How do I change the theme (light/dark)?</h3>
                <p>In the <code>&lt;html&gt;</code> tag, change <code>class="dark"</code> to <code>class="light"</code> or <code>class="auto"</code> for system-based theme.</p>
              </div>

              <div className="faq-item">
                <h3>Can I add more pages?</h3>
                <p>Currently, templates are single-page. Multi-page support is coming soon! Check our <a href="/roadmap">roadmap</a> for updates.</p>
              </div>

              <div className="faq-item">
                <h3>Where can I get help?</h3>
                <p>Email us at <a href="mailto:support@siteforge.com">suppor@nimbus.com</a> and we'll respond within 24 hours.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;