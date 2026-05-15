import 'package:flutter/material.dart';
import 'package:flutter_datetime_picker_plus/flutter_datetime_picker_plus.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../common/api/api_client.dart';
import '../../common/models/service_request.dart';

class BookServiceScreen extends StatefulWidget {
  const BookServiceScreen({super.key});

  @override
  State<BookServiceScreen> createState() => _BookServiceScreenState();
}

class _BookServiceScreenState extends State<BookServiceScreen> {
  final _formKey = GlobalKey<FormState>();
  final _addressController = TextEditingController();
  final _descriptionController = TextEditingController();
  
  ServiceType _selectedServiceType = ServiceType.repair;
  DateTime? _selectedDateTime;
  double? _currentLatitude;
  double? _currentLongitude;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _addressController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _pickDateTime() async {
    DatePicker.showDateTimePicker(
      context,
      showTitleActions: true,
      minTime: DateTime.now().add(const Duration(hours: 2)),
      maxTime: DateTime.now().add(const Duration(days: 30)),
      onConfirm: (date) {
        setState(() {
          _selectedDateTime = date;
        });
      },
      currentTime: DateTime.now(),
      locale: LocaleType.en,
    );
  }

  Future<void> _submitBooking() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    if (_selectedDateTime == null) {
      setState(() {
        _errorMessage = 'Please select a date and time';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // TODO: Get actual token from auth state
      final token = 'dummy_token';
      
      final result = await ApiClient.createServiceRequest(
        type: _selectedServiceType.name,
        scheduledAt: _selectedDateTime!,
        address: _addressController.text,
        latitude: _currentLatitude,
        longitude: _currentLongitude,
        description: _descriptionController.text.isEmpty 
            ? null 
            : _descriptionController.text,
        token: token,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Service booked successfully! ID: ${result['data']['id']}'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Book Service'),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Service Type Selection
              const Text(
                'Service Type',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              ...ServiceType.values.map((type) {
                return RadioListTile<ServiceType>(
                  title: Text(_getServiceTypeDisplay(type)),
                  subtitle: Text(_getServiceTypeDescription(type)),
                  value: type,
                  groupValue: _selectedServiceType,
                  onChanged: (value) {
                    setState(() {
                      _selectedServiceType = value!;
                    });
                  },
                );
              }).toList(),
              
              const SizedBox(height: 24),
              
              // Date & Time Picker
              const Text(
                'Schedule Date & Time',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              InkWell(
                onTap: _pickDateTime,
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          _selectedDateTime != null
                              ? DateFormat('MMM dd, yyyy - HH:mm').format(_selectedDateTime!)
                              : 'Select date and time',
                          style: TextStyle(
                            color: _selectedDateTime != null
                                ? Colors.black
                                : Colors.grey,
                          ),
                        ),
                      ),
                      const Icon(Icons.arrow_drop_down),
                    ],
                  ),
                ),
              ),
              
              const SizedBox(height: 24),
              
              // Address Field
              const Text(
                'Service Address',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _addressController,
                decoration: const InputDecoration(
                  hintText: 'Enter your complete address',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.location_on),
                ),
                validator: (value) {
                  if (value == null || value.length < 10) {
                    return 'Please enter a valid address (min 10 characters)';
                  }
                  return null;
                },
                maxLines: 2,
              ),
              
              const SizedBox(height: 16),
              
              // Description Field (Optional)
              const Text(
                'Description (Optional)',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(
                  hintText: 'Describe the issue or requirements',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.description),
                ),
                maxLines: 3,
                maxLength: 500,
              ),
              
              const SizedBox(height: 24),
              
              // Estimated Price Display
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.blue.shade200),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Estimated Price:',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '₹${_getEstimatedPrice()}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.green,
                      ),
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 24),
              
              // Error Message
              if (_errorMessage != null)
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.red.shade50,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.red.shade200),
                  ),
                  child: Text(
                    _errorMessage!,
                    style: TextStyle(color: Colors.red.shade900),
                  ),
                ),
              
              const SizedBox(height: 16),
              
              // Submit Button
              ElevatedButton(
                onPressed: _isLoading ? null : _submitBooking,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  foregroundColor: Colors.white,
                ),
                child: _isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Text(
                        'Book Service',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getServiceTypeDisplay(ServiceType type) {
    switch (type) {
      case ServiceType.installation:
        return 'CCTV Installation';
      case ServiceType.repair:
        return 'Repair Service';
      case ServiceType.maintenance:
        return 'Maintenance';
      case ServiceType.amcVisit:
        return 'AMC Visit';
    }
  }

  String _getServiceTypeDescription(ServiceType type) {
    switch (type) {
      case ServiceType.installation:
        return 'New CCTV camera setup and configuration';
      case ServiceType.repair:
        return 'Fix broken cameras or wiring issues';
      case ServiceType.maintenance:
        return 'Regular checkup and cleaning';
      case ServiceType.amcVisit:
        return 'Scheduled visit under your AMC plan';
    }
  }

  int _getEstimatedPrice() {
    switch (_selectedServiceType) {
      case ServiceType.installation:
        return 1500;
      case ServiceType.repair:
        return 500;
      case ServiceType.maintenance:
        return 300;
      case ServiceType.amcVisit:
        return 0;
    }
  }
}
