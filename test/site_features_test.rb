require "minitest/autorun"
require "open3"
require "yaml"

class SiteFeaturesTest < Minitest::Test
  ROOT = File.expand_path("..", __dir__)
  SITE_DIR = File.join(ROOT, "_site")
  EXPECTATIONS = YAML.safe_load(File.read(File.join(ROOT, "test", "site_expectations.yml")))

  def self.build_site_once!
    return if defined?(@built) && @built

    stdout, stderr, status = Open3.capture3("bundle", "exec", "jekyll", "build", chdir: ROOT)
    unless status.success?
      raise "Jekyll build failed:\n#{stdout}\n#{stderr}"
    end

    @built = true
  end

  def setup
    self.class.build_site_once!
  end

  def read_site_file(rel_path)
    full = File.join(SITE_DIR, rel_path)
    assert File.exist?(full), "Missing generated file: #{full}"
    File.read(full)
  end

  def assert_all_includes!(haystack, needles, context)
    needles.each do |needle|
      assert_includes haystack, needle, "Missing #{needle.inspect} in #{context}"
    end
  end

  def test_home_has_required_ids
    html = read_site_file("index.html")
    id_tokens = EXPECTATIONS.fetch("home").fetch("required_ids").map { |id| %(id="#{id}") }
    assert_all_includes!(html, id_tokens, "home page")
  end

  def test_home_contains_behavior_hooks_for_pranks_and_audio
    html = read_site_file("index.html")
    js = read_site_file("assets/js/desktop.js")
    home = EXPECTATIONS.fetch("home")
    assert_all_includes!(js, home.fetch("js_hooks"), "desktop script")
    assert_all_includes!(html, home.fetch("required_attributes"), "home page markup")
  end

  def test_navigation_links_are_rendered_from_data
    html = read_site_file("index.html")
    nav_items = YAML.load_file(File.join(ROOT, "_data", "navigation.yml"))

    nav_items.each do |item|
      href = item.fetch("url")
      label = item.fetch("label")
      assert_includes html, %(href="#{href}")
      assert_includes html, label
    end
  end

  def test_expected_page_content
    EXPECTATIONS.fetch("pages").each do |path, fragments|
      html = read_site_file(path)
      assert_all_includes!(html, fragments, path)
    end
  end
end
