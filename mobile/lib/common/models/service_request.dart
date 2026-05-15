enum ServiceType {
  installation,
  repair,
  maintenance,
  amcVisit,
}

enum ServiceStatus {
  pending,
  assigned,
  technicianEnRoute,
  technicianArrived,
  inProgress,
  completed,
  cancelled,
}

class ServiceRequest {
  final String id;
  final String customerId;
  final String? technicianId;
  final String? franchiseId;
  final ServiceType type;
  final ServiceStatus status;
  final DateTime scheduledAt;
  final String address;
  final double? latitude;
  final double? longitude;
  final String? description;
  final List<String>? photos;
  final double totalAmount;
  final double? commissionAmount;
  final double? technicianAmount;
  final int? estimatedDuration;
  final DateTime createdAt;
  final DateTime updatedAt;

  ServiceRequest({
    required this.id,
    required this.customerId,
    this.technicianId,
    this.franchiseId,
    required this.type,
    required this.status,
    required this.scheduledAt,
    required this.address,
    this.latitude,
    this.longitude,
    this.description,
    this.photos,
    required this.totalAmount,
    this.commissionAmount,
    this.technicianAmount,
    this.estimatedDuration,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ServiceRequest.fromJson(Map<String, dynamic> json) {
    return ServiceRequest(
      id: json['id'] as String,
      customerId: json['customerId'] as String,
      technicianId: json['technicianId'] as String?,
      franchiseId: json['franchiseId'] as String?,
      type: _parseServiceType(json['type']),
      status: _parseServiceStatus(json['status']),
      scheduledAt: DateTime.parse(json['scheduledAt']),
      address: json['address'] as String,
      latitude: json['latitude'] as double?,
      longitude: json['longitude'] as double?,
      description: json['description'] as String?,
      photos: json['photos'] != null 
          ? List<String>.from(json['photos'] as List) 
          : null,
      totalAmount: (json['totalAmount'] as num).toDouble(),
      commissionAmount: json['commissionAmount'] != null 
          ? (json['commissionAmount'] as num).toDouble() 
          : null,
      technicianAmount: json['technicianAmount'] != null 
          ? (json['technicianAmount'] as num).toDouble() 
          : null,
      estimatedDuration: json['estimatedDuration'] as int?,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  static ServiceType _parseServiceType(String value) {
    switch (value.toUpperCase()) {
      case 'INSTALLATION':
        return ServiceType.installation;
      case 'REPAIR':
        return ServiceType.repair;
      case 'MAINTENANCE':
        return ServiceType.maintenance;
      case 'AMC_VISIT':
        return ServiceType.amcVisit;
      default:
        return ServiceType.repair;
    }
  }

  static ServiceStatus _parseServiceStatus(String value) {
    switch (value.toUpperCase()) {
      case 'PENDING':
        return ServiceStatus.pending;
      case 'ASSIGNED':
        return ServiceStatus.assigned;
      case 'TECHNICIAN_EN_ROUTE':
        return ServiceStatus.technicianEnRoute;
      case 'TECHNICIAN_ARRIVED':
        return ServiceStatus.technicianArrived;
      case 'IN_PROGRESS':
        return ServiceStatus.inProgress;
      case 'COMPLETED':
        return ServiceStatus.completed;
      case 'CANCELLED':
        return ServiceStatus.cancelled;
      default:
        return ServiceStatus.pending;
    }
  }

  String get typeDisplay {
    switch (type) {
      case ServiceType.installation:
        return 'Installation';
      case ServiceType.repair:
        return 'Repair';
      case ServiceType.maintenance:
        return 'Maintenance';
      case ServiceType.amcVisit:
        return 'AMC Visit';
    }
  }

  String get statusDisplay {
    switch (status) {
      case ServiceStatus.pending:
        return 'Pending';
      case ServiceStatus.assigned:
        return 'Assigned';
      case ServiceStatus.technicianEnRoute:
        return 'Technician En Route';
      case ServiceStatus.technicianArrived:
        return 'Technician Arrived';
      case ServiceStatus.inProgress:
        return 'In Progress';
      case ServiceStatus.completed:
        return 'Completed';
      case ServiceStatus.cancelled:
        return 'Cancelled';
    }
  }
}
