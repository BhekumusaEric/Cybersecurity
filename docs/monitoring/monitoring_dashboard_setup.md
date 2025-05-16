# Monitoring Dashboard Setup

This document outlines the setup and configuration of the monitoring dashboard for the Ethical Hacking LMS application.

## Overview

The monitoring dashboard provides real-time visibility into application performance, user activity, error rates, and system health. It combines data from multiple sources to create a comprehensive view of the application's operational status.

## Dashboard Components

### 1. Application Performance Monitoring

**Key Metrics:**
- API response times
- Page load times
- Database query performance
- Network request latency
- Resource utilization (CPU, memory)

**Alert Thresholds:**
- API response time > 500ms
- Page load time > 3s
- Database query time > 200ms
- Error rate > 1%

### 2. User Activity Monitoring

**Key Metrics:**
- Active users (real-time)
- Session duration
- Feature usage
- Conversion rates
- User flow completion rates

**Visualizations:**
- User activity heatmap
- Session duration distribution
- Feature usage breakdown
- User journey funnel

### 3. Error Tracking

**Key Metrics:**
- Error count by type
- Error rate by endpoint/screen
- Affected users
- New vs. recurring errors

**Alert Thresholds:**
- New error type detected
- Error affecting >5% of users
- Critical path error rate >0.5%

### 4. Infrastructure Monitoring

**Key Metrics:**
- Server CPU/memory usage
- Database connections
- Queue lengths
- Storage utilization
- Network throughput

**Alert Thresholds:**
- CPU usage >80%
- Memory usage >85%
- Database connections >80% of max
- Storage utilization >90%

### 5. Mobile App Monitoring

**Key Metrics:**
- Crash rate by version
- ANR (Application Not Responding) rate
- App launch time
- Screen transition time
- Network errors

**Alert Thresholds:**
- Crash rate >1%
- ANR rate >0.5%
- App launch time >3s

## Data Sources

### 1. Firebase Analytics and Crashlytics

**Configuration:**
```javascript
// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "ethical-hacking-lms.firebaseapp.com",
  projectId: "ethical-hacking-lms",
  storageBucket: "ethical-hacking-lms.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
```

**Data Collection:**
- User demographics
- Session information
- Event tracking
- Crash reports
- Performance metrics

### 2. Prometheus

**Configuration:**
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'api-server'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['api:8080']

  - job_name: 'database'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['db-exporter:9187']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

**Data Collection:**
- System metrics (CPU, memory, disk)
- Application metrics
- Custom business metrics
- API endpoint performance

### 3. ELK Stack (Elasticsearch, Logstash, Kibana)

**Logstash Configuration:**
```
input {
  file {
    path => "/var/log/application/*.log"
    type => "application"
  }
  http {
    port => 8080
    codec => "json"
  }
}

filter {
  if [type] == "application" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:log_level} %{GREEDYDATA:message}" }
    }
    date {
      match => [ "timestamp", "ISO8601" ]
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "lms-logs-%{+YYYY.MM.dd}"
  }
}
```

**Data Collection:**
- Application logs
- Error logs
- Audit logs
- System logs

### 4. Custom API Endpoints

**Configuration:**
```javascript
// Express middleware for metrics collection
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const path = req.route ? req.route.path : req.path;
    
    metrics.recordApiCall({
      path,
      method: req.method,
      statusCode: res.statusCode,
      duration
    });
  });
  
  next();
});
```

**Data Collection:**
- Custom business metrics
- User activity
- Feature usage
- Performance data

## Dashboard Setup

### 1. Grafana Dashboard

**Installation:**
```bash
docker run -d -p 3000:3000 --name=grafana grafana/grafana
```

**Data Sources Configuration:**
- Prometheus: `http://prometheus:9090`
- Elasticsearch: `http://elasticsearch:9200`
- PostgreSQL: `postgres://user:password@postgres:5432/lms`

**Dashboard Panels:**
1. **Application Overview**
   - Active users (real-time)
   - Error rate
   - API response time
   - Server health

2. **User Activity**
   - User registrations
   - Course enrollments
   - Assessment completions
   - Lab usage

3. **Performance Metrics**
   - API response times by endpoint
   - Database query performance
   - Cache hit ratio
   - Resource utilization

4. **Error Tracking**
   - Error count by type
   - Error rate by endpoint
   - Affected users
   - Error trends

5. **Mobile App Performance**
   - Crash rate by version
   - ANR rate
   - App launch time
   - Network errors

### 2. Firebase Console Dashboard

**Custom Dashboard Widgets:**
1. **User Engagement**
   - Daily active users
   - Session duration
   - Screen views
   - User retention

2. **Crash Reporting**
   - Crash-free users
   - Crash-free sessions
   - Issues by severity
   - Issues by platform

3. **Performance Monitoring**
   - App start time
   - Network request success rate
   - Screen render time
   - Memory usage

### 3. Custom Admin Dashboard

**Features:**
1. **User Management**
   - User listing with filters
   - User details and progress
   - Account management
   - Role management

2. **Content Management**
   - Course listing
   - Content editing
   - Assessment management
   - Lab environment control

3. **Analytics**
   - User acquisition
   - Content engagement
   - Assessment performance
   - Completion rates

4. **System Health**
   - Service status
   - Background job status
   - Integration status
   - Storage usage

## Alert Configuration

### 1. Email Alerts

**Configuration:**
```yaml
alertmanager:
  config:
    global:
      smtp_smarthost: 'smtp.example.com:587'
      smtp_from: 'alerts@ethicalhackinglms.com'
      smtp_auth_username: 'alerts@ethicalhackinglms.com'
      smtp_auth_password: 'password'
    
    route:
      group_by: ['alertname', 'cluster', 'service']
      group_wait: 30s
      group_interval: 5m
      repeat_interval: 4h
      receiver: 'team-email'
    
    receivers:
    - name: 'team-email'
      email_configs:
      - to: 'team@ethicalhackinglms.com'
```

### 2. Slack Alerts

**Configuration:**
```yaml
receivers:
- name: 'slack-notifications'
  slack_configs:
  - api_url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX'
    channel: '#monitoring-alerts'
    send_resolved: true
    title: '{{ .GroupLabels.alertname }}'
    text: >-
      {{ range .Alerts }}
        *Alert:* {{ .Annotations.summary }}
        *Description:* {{ .Annotations.description }}
        *Severity:* {{ .Labels.severity }}
        *Time:* {{ .StartsAt }}
      {{ end }}
```

### 3. PagerDuty Integration

**Configuration:**
```yaml
receivers:
- name: 'pagerduty-critical'
  pagerduty_configs:
  - service_key: 'your_pagerduty_service_key'
    description: '{{ .GroupLabels.alertname }}'
    details:
      summary: '{{ .Annotations.summary }}'
      description: '{{ .Annotations.description }}'
      severity: '{{ .Labels.severity }}'
```

## Monitoring Runbook

### 1. Daily Monitoring Tasks

- Review active alerts
- Check error rates and trends
- Monitor user activity metrics
- Verify system performance
- Review crash reports

### 2. Weekly Monitoring Tasks

- Analyze performance trends
- Review resource utilization
- Check database performance
- Analyze user engagement metrics
- Update alert thresholds if needed

### 3. Monthly Monitoring Tasks

- Comprehensive performance review
- Capacity planning
- Security monitoring review
- Dashboard optimization
- Alert configuration review

### 4. Incident Response

1. **Alert Triggered**
   - Acknowledge alert
   - Assess severity and impact
   - Begin investigation

2. **Investigation**
   - Check logs and metrics
   - Identify affected components
   - Determine root cause

3. **Resolution**
   - Implement fix or workaround
   - Verify resolution
   - Update status

4. **Post-Incident**
   - Document incident
   - Conduct post-mortem
   - Implement preventive measures

## Implementation Timeline

1. **Week 1: Setup Core Monitoring**
   - Install Prometheus and Grafana
   - Configure basic metrics collection
   - Set up initial dashboards

2. **Week 2: Application Instrumentation**
   - Implement custom metrics
   - Configure log aggregation
   - Set up error tracking

3. **Week 3: Mobile App Monitoring**
   - Configure Firebase Analytics
   - Set up Crashlytics
   - Implement performance monitoring

4. **Week 4: Alert Configuration**
   - Define alert thresholds
   - Configure notification channels
   - Test alert system

5. **Week 5: Dashboard Refinement**
   - Optimize dashboards
   - Add business metrics
   - Create executive dashboard

6. **Week 6: Documentation and Training**
   - Document monitoring system
   - Create runbooks
   - Train team on monitoring tools
