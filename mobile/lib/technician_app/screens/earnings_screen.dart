import 'package:flutter/material.dart';
import '../../common/api/api_client.dart';

class EarningsScreen extends StatefulWidget {
  const EarningsScreen({super.key});

  @override
  State<EarningsScreen> createState() => _EarningsScreenState();
}

class _EarningsScreenState extends State<EarningsScreen> {
  bool _isLoading = true;
  String? _errorMessage;
  double _totalEarnings = 0;
  double _pendingEarnings = 0;
  double _withdrawnEarnings = 0;
  List<dynamic> _earningsHistory = [];

  @override
  void initState() {
    super.initState();
    _loadEarnings();
  }

  Future<void> _loadEarnings() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // TODO: Get actual token and implement API call
      // final token = 'dummy_token';
      // final response = await ApiClient.getEarnings(token: token);
      
      // Mock data for now
      await Future.delayed(const Duration(seconds: 1));
      
      setState(() {
        _totalEarnings = 15000;
        _pendingEarnings = 5000;
        _withdrawnEarnings = 10000;
        _earningsHistory = [
          {
            'id': '1',
            'amount': 1200,
            'type': 'service',
            'status': 'withdrawn',
            'createdAt': DateTime.now().subtract(const Duration(days: 5)),
          },
          {
            'id': '2',
            'amount': 800,
            'type': 'service',
            'status': 'pending',
            'createdAt': DateTime.now().subtract(const Duration(days: 2)),
          },
          {
            'id': '3',
            'amount': 1500,
            'type': 'service',
            'status': 'pending',
            'createdAt': DateTime.now().subtract(const Duration(days: 1)),
          },
        ];
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Earnings'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildEarningsSummary(),
                  const SizedBox(height: 24),
                  _buildWithdrawButton(),
                  const SizedBox(height: 24),
                  _buildEarningsHistory(),
                ],
              ),
            ),
    );
  }

  Widget _buildEarningsSummary() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Earnings Summary',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            _buildEarningRow('Total Earnings', _totalEarnings, Colors.green),
            const SizedBox(height: 12),
            _buildEarningRow('Pending', _pendingEarnings, Colors.orange),
            const SizedBox(height: 12),
            _buildEarningRow('Withdrawn', _withdrawnEarnings, Colors.blue),
          ],
        ),
      ),
    );
  }

  Widget _buildEarningRow(String label, double amount, Color color) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 16),
        ),
        Text(
          '₹${amount.toStringAsFixed(0)}',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }

  Widget _buildWithdrawButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _pendingEarnings > 0 ? _showWithdrawDialog : null,
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 16),
          backgroundColor: Theme.of(context).colorScheme.primary,
          foregroundColor: Colors.white,
        ),
        child: Text(
          'Withdraw ₹${_pendingEarnings.toStringAsFixed(0)}',
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _buildEarningsHistory() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Earnings History',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _earningsHistory.length,
          itemBuilder: (context, index) {
            final earning = _earningsHistory[index];
            return Card(
              margin: const EdgeInsets.only(bottom: 12),
              child: ListTile(
                leading: Icon(
                  earning['status'] == 'withdrawn'
                      ? Icons.check_circle
                      : Icons.pending,
                  color: earning['status'] == 'withdrawn'
                      ? Colors.green
                      : Colors.orange,
                ),
                title: Text(
                  '₹${earning['amount'].toStringAsFixed(0)}',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                subtitle: Text(
                  _formatDate(earning['createdAt']),
                ),
                trailing: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: earning['status'] == 'withdrawn'
                        ? Colors.green.withOpacity(0.1)
                        : Colors.orange.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    earning['status'].toUpperCase(),
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: earning['status'] == 'withdrawn'
                          ? Colors.green
                          : Colors.orange,
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  void _showWithdrawDialog() {
    final TextEditingController amountController = TextEditingController(
      text: _pendingEarnings.toStringAsFixed(0),
    );

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Withdraw Earnings'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Available: ₹${_pendingEarnings.toStringAsFixed(0)}'),
            const SizedBox(height: 16),
            TextField(
              controller: amountController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Amount to withdraw',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              await _withdrawEarnings(
                double.parse(amountController.text),
              );
            },
            child: const Text('Withdraw'),
          ),
        ],
      ),
    );
  }

  Future<void> _withdrawEarnings(double amount) async {
    setState(() {
      _isLoading = true;
    });

    try {
      // TODO: Implement actual API call
      await Future.delayed(const Duration(seconds: 1));
      
      setState(() {
        _pendingEarnings -= amount;
        _withdrawnEarnings += amount;
        _isLoading = false;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Withdrawal request processed'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Withdrawal failed: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}
