# Security Policy

## Supported Versions

We take security seriously and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| < 0.2.0 | :x:                |

As this project is currently in active development (pre-1.0.0), we focus security efforts on the latest minor version. Once we reach 1.0.0, we will establish a more comprehensive long-term support policy.

## Reporting a Vulnerability

We appreciate responsible disclosure of security vulnerabilities. If you discover a security issue in mulphilog, please report it privately to help us address it before public disclosure.

### How to Report

**Email**: [hammadmajid@proton.me](mailto:hammadmajid@proton.me)

**Subject Line**: `[SECURITY] Brief description of the issue`

### What to Include

Please provide as much information as possible to help us understand and reproduce the issue:

- **Description**: Clear explanation of the vulnerability
- **Impact**: Potential consequences if exploited
- **Steps to Reproduce**: Detailed steps or proof-of-concept code
- **Affected Versions**: Which versions are impacted
- **Suggested Fix**: If you have ideas on how to resolve it (optional)

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your report within **48-72 hours**
- **Updates**: We will keep you informed of our progress as we investigate and develop a fix
- **Timeline**: We aim to release security patches within **7-14 days** for critical issues, depending on complexity
- **Credit**: With your permission, we will acknowledge your contribution in our release notes and CHANGELOG

### Please Do Not

- Publicly disclose the vulnerability before we have released a fix
- Exploit the vulnerability beyond what is necessary to demonstrate the issue
- Access, modify, or delete data belonging to others

## Security Best Practices

When using mulphilog in your applications, please follow these security best practices:

### Credential Management

```typescript
// ❌ DON'T hardcode credentials
const client = Mulphilog({
  username: "my-username",
  password: "my-password123",
});

// ✅ DO use environment variables
const client = Mulphilog({
  username: process.env.MULPHILOG_USERNAME,
  password: process.env.MULPHILOG_PASSWORD,
});
```

### Additional Recommendations

- **Keep Dependencies Updated**: Regularly update mulphilog and its dependencies to receive security patches
- **Use HTTPS**: This library communicates with the Mulphilog API over HTTPS. Never disable SSL verification
- **Timeout Configuration**: Set appropriate timeout values to prevent resource exhaustion
- **Error Handling**: Avoid logging or displaying sensitive information from error messages in production
- **Least Privilege**: Use API credentials with the minimum necessary permissions

## Scope

### In Scope

Security issues related to:

- The mulphilog library code (authentication, API communication, data validation)
- Dependencies used by mulphilog
- Security vulnerabilities in our build/release process
- Information disclosure through error messages or logging

### Out of Scope

- Vulnerabilities in the Mulphilog (M&P) API itself (report these directly to M&P)
- Issues with third-party applications using this library
- Social engineering attacks
- Denial of Service attacks against the M&P API servers
- Issues requiring physical access to a user's system

## Acknowledgments

We believe in recognizing security researchers who help make mulphilog safer. With your permission, we will:

- Credit you in our release notes and CHANGELOG
- List you in this SECURITY.md file (if you wish)
- Provide a reference for your responsible disclosure efforts

### Hall of Fame

Thank you to the following security researchers for their contributions:

_(No reports yet)_

## Questions?

If you have questions about this security policy or need clarification on the reporting process, feel free to reach out at [hammadmajid@proton.me](mailto:hammadmajid@proton.me).

---

**Disclaimer**: This project is not sponsored, affiliated, endorsed, or approved by Mulphilog (M&P). Security reports should only pertain to this open-source wrapper library, not the official M&P services.
