import { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

class SummaryReporter implements Reporter {
  private startTime = Date.now();
  private results: TestResult[] = [];
  private videos: string[] = [];

  onBegin(config: FullConfig, suite: Suite) {
    console.log('\n' + '🎬'.repeat(40));
    console.log('🚀 VitaCare Test Suite Starting');
    console.log(`📹 Video Recording: ENABLED (test-results/videos/)`);
    console.log(`🔍 Trace Collection: on-first-retry`);
    console.log(`📸 Screenshots: only-on-failure`);
    console.log('🎬'.repeat(40) + '\n');
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.push(result);
    
    // Collect video paths
    if (result.attachments) {
      result.attachments.forEach(attachment => {
        if (attachment.name === 'video' && attachment.path) {
          this.videos.push(attachment.path);
        }
      });
    }
  }

  onEnd(result: FullResult) {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const flaky = this.results.filter(r => r.status === 'passed' && r.retry > 0).length;

    console.log('\n' + '🎯'.repeat(50));
    console.log('📊 VitaCare Test Execution Summary');
    console.log('🎯'.repeat(50));
    console.log(`⏱️  Total Duration: ${duration}s`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`🔄 Flaky (passed after retry): ${flaky}`);
    console.log(`📈 Success Rate: ${this.results.length > 0 ? ((passed / this.results.length) * 100).toFixed(1) : 0}%`);
    
    // Show video information
    if (this.videos.length > 0) {
      console.log('\n🎥 Videos Generated:');
      this.videos.forEach((videoPath, index) => {
        const fileName = path.basename(videoPath);
        console.log(`   📹 Video ${index + 1}: ${fileName}`);
      });
      console.log(`\n💡 To view videos: npm run show-video`);
      console.log(`💡 To open latest video: npm run open-video`);
    } else {
      console.log('\n📹 No videos found (check test-results/videos/ directory)');
    }

    // Show artifact locations
    console.log('\n📁 Generated Artifacts:');
    console.log('   📊 HTML Report: playwright-report/index.html');
    console.log('   🎥 Videos: test-results/videos/');
    console.log('   📸 Screenshots: test-results/');
    console.log('   📋 JUnit XML: test-results/junit.xml');
    console.log('   📄 JSON Results: test-results/results.json');
    
    console.log('\n🔗 Quick Access Commands:');
    console.log('   npx playwright show-report  # Open HTML report');
    console.log('   npm run show-video          # List video files');
    console.log('   npm run open-video          # Open latest video');
    
    console.log('🎯'.repeat(50) + '\n');

    // Write summary to JSON file
    const summary = {
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      total: this.results.length,
      passed,
      failed,
      skipped,
      flaky,
      successRate: this.results.length > 0 ? ((passed / this.results.length) * 100).toFixed(1) : '0',
      videos: this.videos,
      artifacts: {
        htmlReport: 'playwright-report/index.html',
        videos: 'test-results/videos/',
        screenshots: 'test-results/',
        junitXml: 'test-results/junit.xml',
        jsonResults: 'test-results/results.json'
      }
    };

    // Ensure test-results directory exists
    const testResultsDir = 'test-results';
    if (!fs.existsSync(testResultsDir)) {
      fs.mkdirSync(testResultsDir, { recursive: true });
    }

    // Write summary
    fs.writeFileSync(
      path.join(testResultsDir, 'summary-report.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log('📄 Summary report saved: test-results/summary-report.json\n');
  }
}

export default SummaryReporter;