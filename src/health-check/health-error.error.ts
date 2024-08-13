export class HealthError extends Error {
  constructor(
    private readonly service: string,
    private readonly messageE: string,
  ) {
    super(`Health check failed for service ${service}: ${messageE}`);
    this.name = "HealthError";
  }

  public toResponse() {
    return {
      status: 500,
      service: this.service,
      message: this.messageE,
    };
  }
}
