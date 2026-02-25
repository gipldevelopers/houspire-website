#!/usr/bin/env python3
"""
Houspire Site Audit Tool
Comprehensive analysis of links, routes, database, performance, SEO, and more
"""

import os
import re
import json
from pathlib import Path
from collections import defaultdict

# Configuration
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')
BASE_URL = 'http://localhost:5173'
SRC_PATH = Path('./src')

class SiteAuditor:
    def __init__(self):
        self.routes = set()
        self.links = set()
        self.broken_links = []
        self.orphaned_pages = []
        self.database_issues = []
        self.performance_issues = []
        self.seo_issues = []
        self.accessibility_issues = []
        self.security_issues = []
        
    def run_full_audit(self):
        """Run complete site audit"""
        print("=" * 80)
        print("🔍 HOUSPIRE SITE AUDIT")
        print("=" * 80)
        print()
        
        print("📍 1. Extracting Routes...")
        self.extract_routes()
        print(f"   Found {len(self.routes)} routes")
        print()
        
        print("🔗 2. Finding Links...")
        self.extract_links()
        print(f"   Found {len(self.links)} unique links")
        print()
        
        print("❌ 3. Checking Broken Links...")
        self.check_broken_links()
        print(f"   Found {len(self.broken_links)} broken links")
        print()
        
        print("🏝️  4. Finding Orphaned Pages...")
        self.find_orphaned_pages()
        print(f"   Found {len(self.orphaned_pages)} orphaned pages")
        print()
        
        print("⚡ 5. Performance Analysis...")
        self.audit_performance()
        print(f"   Found {len(self.performance_issues)} performance issues")
        print()
        
        print("🎯 6. SEO Audit...")
        self.audit_seo()
        print(f"   Found {len(self.seo_issues)} SEO issues")
        print()
        
        print("♿ 7. Accessibility Check...")
        self.audit_accessibility()
        print(f"   Found {len(self.accessibility_issues)} accessibility issues")
        print()
        
        print("🔒 8. Security Audit...")
        self.audit_security()
        print(f"   Found {len(self.security_issues)} security issues")
        print()
        
        self.generate_report()
    
    def extract_routes(self):
        """Extract all routes from router files"""
        app_file = SRC_PATH / 'App.tsx'
        if app_file.exists():
            content = app_file.read_text()
            matches = re.findall(r'path=["\']([^"\']+)["\']', content)
            for match in matches:
                self.routes.add(match)
    
    def extract_links(self):
        """Extract all links from code"""
        tsx_files = list(SRC_PATH.glob('**/*.tsx')) + list(SRC_PATH.glob('**/*.ts'))
        
        link_patterns = [
            r'href=["\']([^"\']+)["\']',
            r'to=["\']([^"\']+)["\']',
            r'navigate\(["\']([^"\']+)["\']',
            r'window\.location\.href\s*=\s*["\']([^"\']+)["\']',
        ]
        
        for file in tsx_files:
            try:
                content = file.read_text()
                for pattern in link_patterns:
                    matches = re.findall(pattern, content)
                    for match in matches:
                        if not match.startswith('http') and not match.startswith('#'):
                            self.links.add(match)
            except Exception as e:
                print(f"   Error reading {file}: {e}")
    
    def check_broken_links(self):
        """Check if links point to valid routes"""
        for link in self.links:
            clean_link = link.split('?')[0].split('#')[0]
            route_exists = False
            
            for route in self.routes:
                route_pattern = route.replace(':id', '[^/]+').replace(':projectId', '[^/]+').replace(':userId', '[^/]+').replace(':roomId', '[^/]+').replace(':designerId', '[^/]+').replace(':shareToken', '[^/]+').replace('*', '.*')
                if re.match(f'^{route_pattern}$', clean_link):
                    route_exists = True
                    break
            
            if not route_exists and clean_link not in ['/', '']:
                self.broken_links.append({
                    'link': link,
                    'type': 'No matching route'
                })
    
    def find_orphaned_pages(self):
        """Find pages that aren't linked from anywhere"""
        page_files = list(SRC_PATH.glob('**/pages/**/*.tsx'))
        
        for page_file in page_files:
            page_name = page_file.stem
            if page_name in ['index', '_app', '_document', '404']:
                continue
            
            is_referenced = False
            for route in self.routes:
                if page_name.lower() in route.lower():
                    is_referenced = True
                    break
            
            for link in self.links:
                if page_name.lower() in link.lower():
                    is_referenced = True
                    break
            
            if not is_referenced:
                self.orphaned_pages.append(str(page_file.relative_to(SRC_PATH)))
    
    def audit_performance(self):
        """Check for performance issues"""
        package_json = Path('./package.json')
        if package_json.exists():
            content = json.loads(package_json.read_text())
            heavy_packages = {
                'moment': 'Use date-fns or dayjs instead (smaller)',
                'lodash': 'Use lodash-es for tree-shaking',
                'axios': 'Use native fetch instead',
            }
            
            deps = {**content.get('dependencies', {}), **content.get('devDependencies', {})}
            for pkg, suggestion in heavy_packages.items():
                if pkg in deps:
                    self.performance_issues.append({
                        'type': 'Heavy Dependency',
                        'package': pkg,
                        'issue': suggestion
                    })
    
    def audit_seo(self):
        """Check SEO issues"""
        page_files = list(SRC_PATH.glob('**/pages/**/*.tsx'))
        
        for page_file in page_files:
            content = page_file.read_text()
            if '<SEO' not in content and 'Helmet' not in content and 'SEOHead' not in content:
                self.seo_issues.append({
                    'type': 'Missing SEO Tags',
                    'file': str(page_file.relative_to(SRC_PATH)),
                    'issue': 'Page missing SEO component'
                })
        
        sitemap = Path('./public/sitemap.xml')
        if not sitemap.exists():
            self.seo_issues.append({
                'type': 'Missing Sitemap',
                'issue': 'sitemap.xml not found in /public'
            })
        
        robots = Path('./public/robots.txt')
        if not robots.exists():
            self.seo_issues.append({
                'type': 'Missing Robots.txt',
                'issue': 'robots.txt not found in /public'
            })
    
    def audit_accessibility(self):
        """Check accessibility issues"""
        tsx_files = list(SRC_PATH.glob('**/*.tsx'))
        
        for file in tsx_files:
            content = file.read_text()
            lines = content.split('\n')
            
            for i, line in enumerate(lines):
                if '<img' in line.lower() and 'alt=' not in line.lower():
                    self.accessibility_issues.append({
                        'type': 'Missing Alt Text',
                        'file': str(file.relative_to(SRC_PATH)),
                        'line': i + 1,
                        'issue': 'Image missing alt attribute'
                    })
    
    def audit_security(self):
        """Check security issues"""
        all_files = list(SRC_PATH.glob('**/*.tsx')) + list(SRC_PATH.glob('**/*.ts'))
        
        sensitive_patterns = [
            (r'api[_-]?key\s*[:=]\s*["\']([a-zA-Z0-9_-]{20,})["\']', 'API Key'),
            (r'secret\s*[:=]\s*["\']([a-zA-Z0-9_-]{20,})["\']', 'Secret'),
        ]
        
        for file in all_files:
            try:
                content = file.read_text()
                for pattern, key_type in sensitive_patterns:
                    matches = re.findall(pattern, content, re.IGNORECASE)
                    if matches and 'import.meta.env' not in content:
                        self.security_issues.append({
                            'type': f'Potential Exposed {key_type}',
                            'file': str(file.relative_to(SRC_PATH)),
                            'issue': f'Check for hardcoded {key_type.lower()}'
                        })
            except Exception:
                pass
    
    def generate_report(self):
        """Generate comprehensive audit report"""
        print("\n" + "=" * 80)
        print("📊 AUDIT REPORT")
        print("=" * 80 + "\n")
        
        total_issues = (
            len(self.broken_links) +
            len(self.orphaned_pages) +
            len(self.database_issues) +
            len(self.performance_issues) +
            len(self.seo_issues) +
            len(self.accessibility_issues) +
            len(self.security_issues)
        )
        
        print(f"🎯 Total Issues Found: {total_issues}\n")
        
        sections = [
            ("🔗 BROKEN LINKS", self.broken_links),
            ("🏝️  ORPHANED PAGES", [{'page': p} for p in self.orphaned_pages]),
            ("💾 DATABASE ISSUES", self.database_issues),
            ("⚡ PERFORMANCE ISSUES", self.performance_issues),
            ("🎯 SEO ISSUES", self.seo_issues),
            ("♿ ACCESSIBILITY ISSUES", self.accessibility_issues),
            ("🔒 SECURITY ISSUES", self.security_issues),
        ]
        
        for title, issues in sections:
            print(f"\n{title} ({len(issues)})")
            print("-" * 80)
            if issues:
                for i, issue in enumerate(issues[:10], 1):
                    print(f"{i}. {json.dumps(issue, indent=2)}")
                if len(issues) > 10:
                    print(f"... and {len(issues) - 10} more")
            else:
                print("✅ No issues found!")
        
        report = {
            'summary': {
                'total_issues': total_issues,
                'routes': len(self.routes),
                'links': len(self.links),
            },
            'broken_links': self.broken_links,
            'orphaned_pages': self.orphaned_pages,
            'database_issues': self.database_issues,
            'performance_issues': self.performance_issues,
            'seo_issues': self.seo_issues,
            'accessibility_issues': self.accessibility_issues,
            'security_issues': self.security_issues,
        }
        
        report_file = Path('./public/audit_report.json')
        report_file.write_text(json.dumps(report, indent=2))
        
        print(f"\n\n📄 Full report saved to: {report_file.absolute()}")
        print("\n✅ Audit complete!")

if __name__ == '__main__':
    auditor = SiteAuditor()
    auditor.run_full_audit()
