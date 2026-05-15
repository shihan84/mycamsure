import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../common/api/api_client.dart';
import '../../common/models/service_request.dart';

class JobDetailsScreen extends StatefulWidget {
  final ServiceRequest job;

  const JobDetailsScreen({super.key, required this.job});

  @override
  State<JobDetailsScreen> createState() => _JobDetailsScreenState();
}

class _JobDetailsScreenState extends State<JobDetailsScreen> {
  bool _isLoading = false;
  String? _errorMessage;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Job Details'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildStatusCard(),
            const SizedBox(height: 24),
            _buildCustomerInfo(),
            const SizedBox(height: 24),
            _buildJobDetails(),
            const SizedBox(height: 24),
            _buildAddressSection(),
            const SizedBox(height: 24),
            _buildActions(),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _getStatusColor(widget.job.status).withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: _getStatusColor(widget.job.status),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Current Status',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: _getStatusColor(widget.job.status),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  widget.job.statusDisplay,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildStatusTimeline(),
        ],
      ),
    );
  }

  Widget _buildStatusTimeline() {
    final statuses = [
      ServiceStatus.pending,
      ServiceStatus.assigned,
      ServiceStatus.technicianEnRoute,
      ServiceStatus.technicianArrived,
      ServiceStatus.inProgress,
      ServiceStatus.completed,
    ];

    return Row(
      children: statuses.map((status) {
        final currentIndex = statuses.indexOf(widget.job.status);
        final statusIndex = statuses.indexOf(status);
        final isCompleted = statusIndex <= currentIndex;
        final isCurrent = status == widget.job.status;

        return Expanded(
          child: Column(
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: isCompleted
                      ? _getStatusColor(widget.job.status)
                      : Colors.grey[300],
                  shape: BoxShape.circle,
                  border: isCurrent
                      ? Border.all(
                          color: _getStatusColor(widget.job.status),
                          width: 3,
                        )
                      : null,
                ),
              ),
              if (statusIndex < statuses.length - 1)
                Expanded(
                  child: Container(
                    height: 2,
                    color: statusIndex < currentIndex
                        ? _getStatusColor(widget.job.status)
                        : Colors.grey[300],
                  ),
                ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildCustomerInfo() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Customer Information',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                const Icon(Icons.person, size: 20, color: Colors.grey),
                const SizedBox(width: 8),
                Text(
                  widget.job.customer?.name ?? 'Unknown',
                  style: const TextStyle(fontSize: 16),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.phone, size: 20, color: Colors.grey),
                const SizedBox(width: 8),
                Text(
                  widget.job.customer?.phone ?? 'Unknown',
                  style: const TextStyle(fontSize: 16),
                ),
                const Spacer(),
                IconButton(
                  onPressed: () async {
                    final phoneUrl = 'tel:${widget.job.customer?.phone}';
                    if (await canLaunchUrl(Uri.parse(phoneUrl))) {
                      await launchUrl(Uri.parse(phoneUrl));
                    }
                  },
                  icon: const Icon(Icons.call),
                  color: Theme.of(context).colorScheme.primary,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildJobDetails() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Job Details',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildDetailRow('Service Type', widget.job.typeDisplay),
            const SizedBox(height: 8),
            _buildDetailRow(
              'Scheduled Time',
              _formatDateTime(widget.job.scheduledAt),
            ),
            const SizedBox(height: 8),
            if (widget.job.estimatedDuration != null)
              _buildDetailRow(
                'Estimated Duration',
                '${widget.job.estimatedDuration} minutes',
              ),
            const SizedBox(height: 8),
            if (widget.job.description != null)
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Description',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(widget.job.description!),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildAddressSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Service Address',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                const Icon(Icons.location_on, size: 20, color: Colors.grey),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    widget.job.address,
                    style: const TextStyle(fontSize: 16),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (widget.job.latitude != null && widget.job.longitude != null)
              Column(
                children: [
                  ElevatedButton.icon(
                    onPressed: _openMaps,
                    icon: const Icon(Icons.map),
                    label: const Text('Open in Google Maps'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  OutlinedButton.icon(
                    onPressed: _openInAppMap,
                    icon: const Icon(Icons.navigation),
                    label: const Text('Navigate'),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildActions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (widget.job.status == ServiceStatus.pending)
          ElevatedButton(
            onPressed: _acceptJob,
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
            ),
            child: const Text(
              'Accept Job',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ),
        if (widget.job.status == ServiceStatus.assigned)
          ElevatedButton(
            onPressed: _updateStatus('TECHNICIAN_EN_ROUTE'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              backgroundColor: Theme.of(context).colorScheme.primary,
              foregroundColor: Colors.white,
            ),
            child: const Text(
              'Start Navigation',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ),
        if (widget.job.status == ServiceStatus.technicianEnRoute)
          ElevatedButton(
            onPressed: _updateStatus('TECHNICIAN_ARRIVED'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              backgroundColor: Theme.of(context).colorScheme.primary,
              foregroundColor: Colors.white,
            ),
            child: const Text(
              'Mark as Arrived',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ),
        if (widget.job.status == ServiceStatus.technicianArrived)
          ElevatedButton(
            onPressed: _updateStatus('IN_PROGRESS'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              backgroundColor: Theme.of(context).colorScheme.primary,
              foregroundColor: Colors.white,
            ),
            child: const Text(
              'Start Work',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ),
        if (widget.job.status == ServiceStatus.inProgress)
          ElevatedButton(
            onPressed: _completeJob,
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
            ),
            child: const Text(
              'Complete Job',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ),
      ],
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 120,
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
            ),
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: const TextStyle(fontSize: 14),
          ),
        ),
      ],
    );
  }

  Future<void> _acceptJob() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // TODO: Get actual token
      final token = 'dummy_token';
      
      await ApiClient.updateJobStatus(
        jobId: widget.job.id,
        status: 'ASSIGNED',
        token: token,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Job accepted successfully'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _updateStatus(String status) async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // TODO: Get actual token
      final token = 'dummy_token';
      
      await ApiClient.updateJobStatus(
        jobId: widget.job.id,
        status: status,
        token: token,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Status updated to $status'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _completeJob() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // TODO: Get actual token
      final token = 'dummy_token';
      
      await ApiClient.updateJobStatus(
        jobId: widget.job.id,
        status: 'COMPLETED',
        token: token,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Job completed successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _openMaps() async {
    if (widget.job.latitude == null || widget.job.longitude == null) return;

    final url = 'https://www.google.com/maps/dir/?api=1&destination=${widget.job.latitude},${widget.job.longitude}';
    
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
    }
  }

  Future<void> _openInAppMap() async {
    if (widget.job.latitude == null || widget.job.longitude == null) return;

    // This would open Google Maps within the app
    // For now, we'll use the external URL
    await _openMaps();
  }

  Color _getStatusColor(ServiceStatus status) {
    switch (status) {
      case ServiceStatus.pending:
        return Colors.orange;
      case ServiceStatus.assigned:
        return Colors.blue;
      case ServiceStatus.technicianEnRoute:
        return Colors.purple;
      case ServiceStatus.technicianArrived:
        return Colors.teal;
      case ServiceStatus.inProgress:
        return Colors.indigo;
      case ServiceStatus.completed:
        return Colors.green;
      case ServiceStatus.cancelled:
        return Colors.red;
    }
  }

  String _formatDateTime(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} at ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
  }
}
