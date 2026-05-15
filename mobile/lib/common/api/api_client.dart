import 'dart:convert';
import 'package:http/http.dart' as http;
import 'firebase_auth_helper.dart';
import '../models/service_request.dart';

class ApiClient {
  static const String baseUrl = 'http://10.0.2.2:3000/api'; // For Android emulator
  // static const String baseUrl = 'http://localhost:3000/api'; // For web/iOS
  // static const String baseUrl = 'http://192.168.x.x:3000/api'; // For physical device

  static Future<Map<String, String>> _headers() async {
    final token = await FirebaseAuthHelper.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  static Future<Map<String, dynamic>> createServiceRequest({
    required String customerId,
    required String type,
    required DateTime scheduledAt,
    required String address,
    required double latitude,
    required double longitude,
    String? description,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/service-request'),
        headers: await _headers(),
        body: jsonEncode({
          'customerId': customerId,
          'type': type,
          'scheduledAt': scheduledAt.toIso8601String(),
          'address': address,
          'latitude': latitude,
          'longitude': longitude,
          'description': description,
        }),
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to create service request: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<List<ServiceRequest>> getNearbyJobs({
    required double latitude,
    required double longitude,
    required int radiusKm,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/jobs/nearby?lat=$latitude&lng=$longitude&radius=$radiusKm'),
        headers: await _headers(),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return (data['data'] as List)
            .map((job) => ServiceRequest.fromJson(job))
            .toList();
      } else {
        throw Exception('Failed to fetch nearby jobs');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<Map<String, dynamic>> updateJobStatus({
    required String jobId,
    required String status,
  }) async {
    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/jobs/$jobId/status'),
        headers: await _headers(),
        body: jsonEncode({
          'status': status,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to update job status');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }
}
